import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { CSSPluginClass } from "../stylesheet/CSSplugin";
import { Concat, hashString } from "../../Utils";
import { VueStyleFile, VueScriptFile, VueTemplateFile } from './VueBlockFiles';
import * as path from "path";
import {each} from "realm-utils";
import { TrimPlugin, AddScopeIdPlugin } from './PostCSSPlugins';
const vueCompiler = require("vue-template-compiler");
const postcss = require('postcss');
const DEFAULT_OPTIONS = {
  script: null,
  template: null,
  style: [new CSSPluginClass()]
};

export class VueComponentClass implements Plugin {
  public test: RegExp = /\.vue$/
  public options: any;

  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  public init(context: WorkFlowContext) {
      context.allowExtension(".vue");
  }

  private getDefaultExtension(block: any) {
    switch (block.type) {
      case 'template':
        return 'html';
      case 'script':
        return 'js';
      case 'style':
        return 'css';
    }
  }

  private createVirtualFile(file: File, block: any, scopeId: string, pluginChain: Plugin[]) {
    let extension = block.lang || this.getDefaultExtension(block);
    let src = `./${block.type}.${extension}`;

    if (block.src) {
      extension = path.extname(block.src);
      src = extension ? block.src : `${block.src}.${block.lang || this.getDefaultExtension(block)}`;
    }

    const fileInfo = file.collection.pm.resolve(src, file.info.absDir);

    switch (block.type) {
      case 'script':
        return new VueScriptFile(file.context, fileInfo, block, scopeId, pluginChain);
      case 'template':
        return new VueTemplateFile(file.context, fileInfo, block, scopeId, pluginChain);
      case 'style':
        return new VueStyleFile(file.context, fileInfo, block, scopeId, pluginChain);
    }
  }

  private async applyScopeIdToStyles(file: File, scopeId: string) {
    const plugins = [
      TrimPlugin(),
      AddScopeIdPlugin({ id: scopeId })
    ];

    return postcss(plugins).process(file.contents, {
      map: false
    }).then((result) => {
      file.contents = result.css;
      return file;
    });
  }

  public transform(file: File) {
    const concat = new Concat(true, "", "\n");

    concat.add(null, "var _options = {}");
    file.loadContents();

    const component = vueCompiler.parseComponent(file.contents);
    const hasScopedStyles = component.styles && component.styles.find((style) => style.scoped);
    const scopeId = hasScopedStyles ? `data-v-${hashString(file.info.absPath)}` : null;

    if (component.template) {
      const templateFile = this.createVirtualFile(file, component.template, scopeId, this.options.template);
      templateFile.loadContents();
      concat.add(null, templateFile.contents);
    }

    if (component.script) {
      const scriptFile = this.createVirtualFile(file, component.script, scopeId, this.options.script) as VueScriptFile;
      scriptFile.loadContents();
      concat.add(null, scriptFile.contents, scriptFile.sourceMapText);
      concat.add(null, "Object.assign(exports.default, _options)");
    }

    file.addStringDependency("fuse-box-css");

    return each(component.styles, style => {
      const styleFile = this.createVirtualFile(file, style, scopeId, []);
      styleFile.loadContents();

      if (!styleFile.contents) {
        return Promise.resolve(styleFile);
      }

      return this.options.style.reduce((chain, plugin) => {
        return chain.then((file: File) => {
          if (plugin instanceof CSSPluginClass && styleFile.block.scoped) {
            return this.applyScopeIdToStyles(file, scopeId);
          }

          return Promise.resolve(file);
        })
        .then((file: File) => {
          const promise = plugin.transform(file);
          return (promise || Promise.resolve(file)).then(() => file);
        });
      }, Promise.resolve(styleFile)).then(() => styleFile);
    }).then((styleFiles) => {
      return each(styleFiles, file => {
        if (file.alternativeContent) {
           concat.add(null, file.alternativeContent, file.sourceMap);
         } else {
           // TODO: Do we need this anymore? Everything seems to work without?
           concat.add(null, `require('fuse-box-css')('${file.info.fuseBoxPath}', ${JSON.stringify(file.contents)})`, file.sourceMap);
         }
      });
    }).then(() => {
        file.contents = concat.content.toString();
        file.sourceMap = concat.sourceMap.toString();
        file.analysis.parseUsingAcorn();
        file.analysis.analyze();
        file.analysis.dependencies.forEach(dep => file.resolveLater(dep));
    });
  }
}

export const VueComponentPlugin = (options: any) => {
    return new VueComponentClass(options);
};
