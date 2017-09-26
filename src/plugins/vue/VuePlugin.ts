import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { CSSPluginClass } from "../stylesheet/CSSplugin";
import { FuseBoxHTMLPlugin } from "../HTMLplugin";
import { Concat, hashString } from "../../Utils";
import { VueBlockFile } from './VueBlockFile';
import { VueTemplateFile } from './VueTemplateFile';
import { VueStyleFile } from './VueStyleFile';
import { VueScriptFile } from './VueScriptFile';
import * as path from "path";
import * as fs from "fs";
import {each} from "realm-utils";
const vueCompiler = require("vue-template-compiler");
const DEFAULT_OPTIONS: IVueComponentPluginOptions = {
  script: [],
  template: [new FuseBoxHTMLPlugin()],
  style: [new CSSPluginClass()]
};

export interface IVueComponentPluginOptions {
  script: Plugin[],
  template: Plugin[],
  style: Plugin[]
}

export class VueComponentClass implements Plugin {
  public test: RegExp = /\.vue$/
  public options: IVueComponentPluginOptions;

  constructor(options: IVueComponentPluginOptions) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.options.script = Array.isArray(this.options.script) ? this.options.script : [this.options.script];
    this.options.template = Array.isArray(this.options.template) ? this.options.template : [this.options.template];
    this.options.style = Array.isArray(this.options.style) ? this.options.style : [this.options.style];
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

  private createVirtualFile(file: File, block: any, scopeId: string, pluginChain: Plugin[]): VueBlockFile {
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

  private addToCacheObject(cacheItem: any, path: string, contents: string, sourceMap: any) {
    cacheItem[path] = {
      contents,
      sourceMap
    };
  }

  public async transform(file: File) {
    const bundle = file.context.bundle
    let cacheValid = false;

    if (file.loadFromCache()) {
      const data = file.cacheData;
      cacheValid = true;

      if (bundle && bundle.lastChangedFile) {
        if (data.template[bundle.lastChangedFile] || data.script[bundle.lastChangedFile] || data.styles[bundle.lastChangedFile]) {
          cacheValid = false;
        }
      }
    }

    if (!cacheValid) {
      file.isLoaded = false;
      file.cached  = false;
      file.analysis.skipAnalysis = false;
    } else {
      console.log(file.sourceMap)
    }

    const concat = new Concat(true, "", "\n");

    concat.add(null, "var _options = {}");
    file.loadContents();

    const cache = {
      template : {},
      script : {},
      styles: {}
    };
    const component = vueCompiler.parseComponent(fs.readFileSync(file.info.absPath).toString());
    const hasScopedStyles = component.styles && component.styles.find((style) => style.scoped);
    const scopeId = hasScopedStyles ? `data-v-${hashString(file.info.absPath)}` : null;

    if (component.template) {
      const templateFile = this.createVirtualFile(file, component.template, scopeId, this.options.template);

      if (cacheValid) {
        const templateCacheData = file.cacheData.template[templateFile.info.fuseBoxPath];
        this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateCacheData.contents, templateCacheData.sourceMap);
      } else {
        await templateFile.process();
        this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateFile.contents, templateFile.sourceMap);
        concat.add(null, templateFile.contents);
      }
    }

    if (component.script) {
      const scriptFile = this.createVirtualFile(file, component.script, scopeId, this.options.script);

      if (cacheValid) {
        const scriptCacheData = file.cacheData.script[scriptFile.info.fuseBoxPath];
        scriptFile.isLoaded = true;
        scriptFile.contents = scriptCacheData.contents;
        scriptFile.sourceMap = scriptCacheData.sourceMap;
        this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptCacheData.contents, scriptCacheData.sourceMap);
      } else {
        await scriptFile.process();
        this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptFile.contents, scriptFile.sourceMap);
        concat.add(null, scriptFile.contents, scriptFile.sourceMap);
        concat.add(null, "Object.assign(exports.default, _options)");
      }
    }

    if (component.styles && component.styles.length > 0) {
      file.addStringDependency("fuse-box-css");

      const styleFiles = await each(component.styles, (styleBlock) => {
        const styleFile = this.createVirtualFile(file, styleBlock, scopeId, this.options.style) as VueStyleFile;

        if (cacheValid) {
          const CSSPlugin = this.options.style.find((plugin) => plugin instanceof CSSPluginClass);
          styleFile.isLoaded = true;
          styleFile.contents = file.cacheData.styles[styleFile.info.fuseBoxPath].contents;
          styleFile.sourceMap = file.cacheData.styles[styleFile.info.fuseBoxPath].sourceMap;
          cache.styles[styleFile.info.fuseBoxPath] = {
            contents: styleFile.contents,
            sourceMap: styleFile.sourceMap
          };
          styleFile.fixSourceMapName();
          return (CSSPlugin.transform(styleFile) || Promise.resolve()).then(() => styleFile);
        } else {
          return styleFile.process().then(() => styleFile).then(() => {
            this.addToCacheObject(cache.styles, styleFile.info.fuseBoxPath, styleFile.contents, styleFile.sourceMap);

            if (styleFile.cssDependencies) {
              styleFile.cssDependencies.forEach((path) => {
                cache.styles[path] = 1;
              })
            }

            return styleFile;
          });
        }
      });

      await each(styleFiles, (styleFile) => {
        if (styleFile.alternativeContent) {
           concat.add(null, styleFile.alternativeContent);
         } else {
           // TODO: Do we need this anymore? Everything seems to work without?
           concat.add(null, `require('fuse-box-css')('${styleFile.info.fuseBoxPath}', ${JSON.stringify(styleFile.contents)})`, styleFile.sourceMap);
         }
       });
    }

    if (!cacheValid) {
      file.contents = concat.content.toString();
      file.sourceMap = concat.sourceMap.toString();
      file.analysis.parseUsingAcorn();
      file.analysis.analyze();
      file.analysis.dependencies.forEach(dep => file.resolveLater(dep));
    }

    if (file.context.useCache) {
      file.setCacheData(cache);
      file.context.cache.writeStaticCache(file, file.sourceMap);
    }
  }
}

export const VueComponentPlugin = (options: any) => {
    return new VueComponentClass(options);
};
