import { File } from "../core/File";
import { IPathInformation } from "../core/PathMaster";
import { WorkFlowContext } from "../core/WorkflowContext";
import { Plugin } from "../core/WorkflowContext";
import { SassPlugin } from "./stylesheet/SassPlugin";
import * as fs from "fs";
import * as path from "path";
import * as hash from 'shorthash';
import * as postcss from 'postcss';
import * as selectorParser from 'postcss-selector-parser';

const DEFAULT_BABEL_CONFIG = { plugins: ['transform-es2015-modules-commonjs'] };

let vueCompiler;
let vueTranspiler;
let typescriptTranspiler;
let babelCore;
let babelConfig;

export interface VuePluginOptions {
    babel?: any,
}

interface IVueComponent {
  template: IVueComponentBlock;
  script: IVueComponentBlock;
  styles: IVueComponentStyleBlock[];
}

interface IVueComponentBlock {
  type: string;
  content: string;
  start: number;
  attrs: IVueComponentBlockAttributes;
  src: string;
  end: number;
}

interface IVueComponentStyleBlock extends IVueComponentBlock {
  scoped?: boolean;
}

interface IVueComponentBlockAttributes {
  src: string;
  lang?: string;
  comments?: string;
}

class VueBlockFile extends File {
  constructor(public context: WorkFlowContext, public info: IPathInformation, public block: IVueComponentBlock) {
    super(context, info);
  }

  loadContents() {
    if (this.isLoaded) {
      return;
    }

    if (this.block.attrs && this.block.attrs.src) {
      const fileName = this.block.attrs.src.substr(this.block.attrs.src.lastIndexOf('.') + 1);
      const extension = path.extname(this.block.attrs.src) || this.block.attrs.lang || getDefaultExtension(this.block);
      const blockFileName = `${fileName}.${extension}`;
      const blockFilePath = path.join(this.info.absDir, blockFileName);
      this.contents = fs.readFileSync(blockFilePath).toString();
      this.info.absPath = blockFilePath;
      this.info.fuseBoxPath = `${this.info.fuseBoxPath.substr(0, this.info.fuseBoxPath.lastIndexOf('/'))}${blockFileName}`;
    } else {
      this.contents = this.block.content;
    }

    this.isLoaded = true;
  }
}

export class VuePluginClass implements Plugin {
  public test: RegExp = /\.vue$/;

  constructor(public options: VuePluginOptions = {}) {}

  public init(context: WorkFlowContext) {
      context.allowExtension(".vue");
  }

  public transform(file: File) {
    const context = file.context;

    if (context.useCache) {
      const cached = context.cache.getStaticCache(file);

      if (cached) {
          file.isLoaded = true;

          if (cached.sourceMap) {
              file.sourceMap = cached.sourceMap;
          }

          file.analysis.skip();
          file.analysis.dependencies = cached.dependencies;
          file.contents = cached.contents;
          return;
      }
    }

    file.loadContents();

    if (!vueCompiler) {
        vueCompiler = require("vue-template-compiler");
        vueTranspiler = require("vue-template-es2015-compiler");
    }

    const component: IVueComponent = vueCompiler.parseComponent(file.contents);
    const scopeId = generateScopeId(file);

    if (component.styles.length > 0) {
      file.addStringDependency("fuse-box-css");
    }

    return Promise.all([
      processTemplate(context, file, component.template),
      processScript(context, file, component.script),
      ...component.styles.map((styleBlock) => processStyles(context, file, styleBlock, scopeId))
    ])
    .then((files) => generateOutput(file, scopeId, ...files))
    .then((output) => {
      file.contents = output;
      file.analysis.parseUsingAcorn();
      file.analysis.analyze();

      if (context.useCache) {
        context.emitJavascriptHotReload(file);
        context.cache.writeStaticCache(file, file.sourceMap);
      }
    })
    .catch(error => console.log(error));
  }
}

export const VuePlugin = () => {
    return new VuePluginClass();
};

function getDefaultExtension(block: IVueComponentBlock) {
  switch (block.type) {
    case 'template':
      return 'html';
    case 'script':
      return 'js';
    case 'style':
      return 'css';
  }
}

function toFunction (code) {
  return vueTranspiler(`function render () {${code}}`);
}

function generateScopeId(file: File) {
  return `data-v-${hash.unique(file.info.fuseBoxPath)}`;
}

function createPlugin(scopeId: string) {
  return postcss.plugin('add-id', function () {
    return function (root) {
      root.each(function rewriteSelector (node) {
        if (!(node as any).selector) {
          if (node.type === 'atrule' && node.name === 'media') {
            node.each(rewriteSelector)
          }
          return
        }

        (node as any).selector = selectorParser(function (selectors) {
          selectors.each(function (selector) {
            var node = null
            selector.each(function (n) {
              if (n.type !== 'pseudo') {
                node = n;
              }
            });
            selector.insertAfter(node, selectorParser.attribute({
              attribute: scopeId
            }));
          })
        }).process((node as any).selector).result
      });
    };
  });
}

function processTemplate(context: WorkFlowContext, file: File, block: IVueComponentBlock): Promise<VueBlockFile> {
    const blockFile = new VueBlockFile(file.context, JSON.parse(JSON.stringify(file.info)), block);
    const engine = (block.attrs) ? block.attrs.lang : null;
    const consolidate = require('consolidate');

    blockFile.loadContents();

    if (!engine && !consolidate[engine]) {
      return Promise.resolve(blockFile);
    }

    return new Promise<VueBlockFile>((resolve, reject) => {
      consolidate[engine].render(blockFile.contents, {
          filename: 'base',
          basedir: context.homeDir,
          includeDir: context.homeDir
      }, (error, html) => {
          if (error) {
            return reject(error);
          }

          blockFile.contents = html;
          resolve(blockFile);
      });
    });
}

function processScript(context: WorkFlowContext, file: File, block: IVueComponentBlock): Promise<VueBlockFile> {
  const blockFile = new VueBlockFile(file.context, JSON.parse(JSON.stringify(file.info)), block);
  const language = block.attrs.lang;

  blockFile.loadContents();

  if (language === "babel") {
    if (!babelCore) {
        babelCore = require("babel-core");
        let babelConfig = this.options.babel.config || getBabelConfig(context);

        if (!babelConfig) {
            babelConfig = DEFAULT_BABEL_CONFIG;
        }
      }

      try {
          blockFile.contents = babelCore.transform(blockFile.contents, babelConfig);
          return Promise.resolve(blockFile);
      } catch (error) {
          return Promise.reject(error);
      }
  } else {
    if (!typescriptTranspiler) {
        typescriptTranspiler = require("typescript");
    }

    try {
        blockFile.contents = typescriptTranspiler.transpileModule(blockFile.contents, context.getTypeScriptConfig()).outputText;
        return Promise.resolve(blockFile);
    } catch (error) {
        return Promise.reject(error);
    }
  }
}

function getBabelConfig(context: WorkFlowContext) {
  if (!babelConfig) {
    const babelRcPath = path.join(context.appRoot, `.babelrc`);

    if (fs.existsSync(babelRcPath)) {
        const babelRcConfig = fs.readFileSync(babelRcPath).toString();

        if (babelRcConfig) {
          babelConfig = JSON.parse(babelRcConfig);
        }
    }
  }
}

function processStyles(context: WorkFlowContext, file: File, block: IVueComponentStyleBlock, scopeId: string): Promise<VueBlockFile> {
  const blockFile = new VueBlockFile(file.context, JSON.parse(JSON.stringify(file.info)), block);

  blockFile.loadContents();

  return SassPlugin({ importer: true }).transform(blockFile)
    .then(() => {
      if (!block.scoped) {
        return Promise.resolve(blockFile);
      }

      return postcss([createPlugin(scopeId)]).process(blockFile.contents).then((content) => {
        blockFile.contents = content.css;
        return blockFile;
      });
    });
}

function generateOutput(parentFile: File, scopeId: string, ...files: VueBlockFile[]) {
  const scopedStyles = files.filter((file) => file.block.type === 'style' && (file.block.attrs as IVueComponentStyleBlock).scoped);
  const globalStyles = files.filter((file) => file.block.type === 'style' && !(file.block.attrs as IVueComponentStyleBlock).scoped);
  const template = files.find((file) => file.block.type === 'template');
  const script = files.find((file) => file.block.type === 'script');
  const compiledHtml = vueCompiler.compile(template.contents, {
    scopeId: scopedStyles.length > 0 ? scopeId : null,
  });
  let styles = '';

  if (globalStyles.length > 0) {
    styles += globalStyles.map((globalStyle) => globalStyle.contents).join('\n');
  }

  if (scopedStyles.length > 0) {
    styles += scopedStyles.map((scopedStyle) => scopedStyle.contents).join('\n');
  }

  if (styles) {
    styles = `require("fuse-box-css")(${JSON.stringify(parentFile.info.fuseBoxPath)}, ${JSON.stringify(styles)});`;
  }

  return `var _p = {};
          var _v = function(exports){${script.contents}};
          ${styles}
          _p.render = ` + toFunction(compiledHtml.render) + `
          _p.staticRenderFns = [ ` + compiledHtml.staticRenderFns.map(toFunction).join(',') + ` ];
          var _e = { _scopeId: ${scopedStyles.length > 0 ? '"' + scopeId + '"' : null}}; _v(_e); Object.assign(_e.default.options||_e.default, _p)
          module.exports = _e
          `;
}
