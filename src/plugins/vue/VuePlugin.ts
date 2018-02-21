import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { CSSPluginClass } from "../stylesheet/CSSplugin";
import { Concat, hashString, ensurePublicExtension } from "../../Utils";
import { VueBlockFile } from './VueBlockFile';
import { VueTemplateFile } from './VueTemplateFile';
import { VueStyleFile } from './VueStyleFile';
import { VueScriptFile } from './VueScriptFile';
import * as path from "path";
import * as fs from "fs";
import { each } from "realm-utils";

export interface IVueComponentPluginOptions {
  script?: Plugin[],
  template?: Plugin[],
  style?: Plugin[]
}

export class VueComponentClass implements Plugin {
  public dependencies: ["process", "fusebox-hot-reload"];
  public test: RegExp = /\.vue$/
  public options: IVueComponentPluginOptions;
  public hasProcessedVueFile = false;

  constructor(options: IVueComponentPluginOptions) {
    this.options = Object.assign({}, {
      script: [],
      template: [],
      style: []
    }, options);

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
        let srcExtension = path.extname(block.src) || '';

        if (srcExtension.indexOf('.') > -1) {
          srcExtension = srcExtension.substr(1);
          extension = srcExtension;
          src = block.src;
        } else {
          extension = (block.lang) ? `${block.lang}` : '' || this.getDefaultExtension(block);
          src = `${block.src}.${extension}`;
        }
    }

    file.context.allowExtension(`.${extension}`);
    const fileInfo = file.collection.pm.resolve(src, file.info.absDir);

    switch (block.type) {
      case 'script':
        return new VueScriptFile(file, fileInfo, block, scopeId, pluginChain);
      case 'template':
        return new VueTemplateFile(file, fileInfo, block, scopeId, pluginChain);
      case 'style':
        return new VueStyleFile(file, fileInfo, block, scopeId, pluginChain);
    }
  }

  private addToCacheObject(cacheItem: any, path: string, contents: string, sourceMap: any, file: VueBlockFile) {
    cacheItem[path] = {
      contents,
      sourceMap
    };

    cacheItem.override = (file.hasExtensionOverride) ? file.info.absPath : '';
  }

  private isFileInCacheData (block: any, override: any, path: string) {
    return (block[path] || (override && override.indexOf(path) > -1));
  }

  public bundleEnd(context: WorkFlowContext) {
    if (context.useCache && this.hasProcessedVueFile) {
      const hasGlobal = context.isGlobalyIgnored('process')
      const process = hasGlobal ? 'global.process' : 'process'
      const importProcess = hasGlobal ? '' : 'var process = FuseBox.import(\'process\');\n\n'
      context.source.addContent(`${importProcess}
        if (${process}.env.NODE_ENV !== "production") {
          var api = FuseBox.import('vue-hot-reload-api');
          var Vue = FuseBox.import('vue');

          api.install(Vue);

          FuseBox.addPlugin({
            hmrUpdate: function (data) {
              var componentWildcardPath = '~/' + data.path.substr(0, data.path.lastIndexOf('/') + 1) + '*.vue';
              var isComponentStyling = (data.type === "css" && !!FuseBox.import(componentWildcardPath));

              if (data.type === "js" && /.vue$/.test(data.path) || isComponentStyling) {
                var fusePath = '~/' + data.path;

                FuseBox.flush();

                FuseBox.flush(function (file) {
                  return file === data.path;
                });

                FuseBox.dynamic(data.path, data.content);

                if (!isComponentStyling) {
                  var component = FuseBox.import(fusePath).default;
                  api.reload(component._vueModuleId||component.options._vueModuleId, component);
                }

                return true;
              }
            }
          });
        }
        `);
      }
  }

  public async transform(file: File) {
    this.hasProcessedVueFile = true;
    const vueCompiler = require("vue-template-compiler");
    const bundle = file.context.bundle
    let cacheValid = false;

    if (file.context.useCache && file.loadFromCache()) {
      const data = file.cacheData;
      cacheValid = true;

      if (bundle && bundle.lastChangedFile) {
        const lastChangedFusePath = ensurePublicExtension(bundle.lastChangedFile);

        if (this.isFileInCacheData(data.template, data.template.override, lastChangedFusePath) ||
            this.isFileInCacheData(data.script, data.script.override, lastChangedFusePath) ||
            this.isFileInCacheData(data.styles, data.styles.override, lastChangedFusePath)) {
          cacheValid = false;
        }
      }
    }

    if (!cacheValid) {
      file.isLoaded = false;
      file.cached  = false;
      file.analysis.skipAnalysis = false;
    }

    const concat = new Concat(true, "", "\n");

    file.loadContents();

    const cache = {
      template : {},
      script : {},
      styles: {}
    };
    const component = vueCompiler.parseComponent(fs.readFileSync(file.info.absPath).toString());
    const hasScopedStyles = component.styles && !!component.styles.find((style) => style.scoped);
    const moduleId = `data-v-${hashString(file.info.absPath)}`;
    const scopeId = hasScopedStyles ? moduleId : null;

    concat.add(null, `var _options = { _vueModuleId: '${moduleId}'}`);

    if (hasScopedStyles) {
      concat.add(null, `Object.assign(_options, {_scopeId: '${scopeId}'})`);
    }

    if (component.template) {
      const templateFile = this.createVirtualFile(file, component.template, scopeId, this.options.template);
      templateFile.setPluginChain(component.template, this.options.template);

      if (cacheValid) {
        const templateCacheData = file.cacheData.template[templateFile.info.fuseBoxPath];
        this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateCacheData.contents, templateCacheData.sourceMap, templateFile);
      } else {
        await templateFile.process();
        this.addToCacheObject(cache.template, templateFile.info.fuseBoxPath, templateFile.contents, templateFile.sourceMap, templateFile);
        concat.add(null, templateFile.contents);
      }
    }

    if (component.script) {
      const scriptFile = this.createVirtualFile(file, component.script, scopeId, this.options.script);
      scriptFile.setPluginChain(component.script, this.options.script);

      if (cacheValid) {
        const scriptCacheData = file.cacheData.script[scriptFile.info.fuseBoxPath];
        scriptFile.isLoaded = true;
        scriptFile.contents = scriptCacheData.contents;
        scriptFile.sourceMap = scriptCacheData.sourceMap;
        this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptCacheData.contents, scriptCacheData.sourceMap, scriptFile);
      } else {
        await scriptFile.process();
        this.addToCacheObject(cache.script, scriptFile.info.fuseBoxPath, scriptFile.contents, scriptFile.sourceMap, scriptFile);
        concat.add(null, scriptFile.contents, scriptFile.sourceMap);
        concat.add(null, `Object.assign(exports.default.options||exports.default, _options)`);
      }
    } else {
      if (!cacheValid) {
        concat.add(null, "exports.default = {}");
        concat.add(null, `Object.assign(exports.default.options||exports.default, _options)`);
      }
    }

    if (component.styles && component.styles.length > 0) {
      file.addStringDependency("fuse-box-css");

      const styleFiles = await each(component.styles, (styleBlock) => {
        const styleFile = this.createVirtualFile(file, styleBlock, scopeId, this.options.style) as VueStyleFile;
        styleFile.setPluginChain(styleBlock, this.options.style);

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
            this.addToCacheObject(cache.styles, styleFile.info.fuseBoxPath, styleFile.contents, styleFile.sourceMap, styleFile);

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

    if (file.context.useCache) {
      const hasGlobal = file.context.isGlobalyIgnored('process')
      const process = hasGlobal ? 'global.process' : 'process'
      const importProcess = hasGlobal ? '' : 'var process = FuseBox.import(\'process\');\n\n'
      concat.add(null, `${importProcess}
        if (${process}.env.NODE_ENV !== "production") {
          var api = require('vue-hot-reload-api');

          if (api && !api.isRecorded('${moduleId}')) {
            api.createRecord('${moduleId}', module.exports.default);
          }
        }
      `);

      file.addStringDependency("vue-hot-reload-api");
    }

    file.addStringDependency('vue');

    if (!cacheValid) {
      file.contents = concat.content.toString();
      file.sourceMap = concat.sourceMap.toString();
      file.analysis.parseUsingAcorn();
      file.analysis.analyze();
    }

    if (file.context.useCache && !cacheValid) {
      file.setCacheData(cache);
      file.context.cache.writeStaticCache(file, file.sourceMap);
      file.context.emitJavascriptHotReload(file);
    }
  }
}

export const VueComponentPlugin = (options: any = {}) => {
    return new VueComponentClass(options);
};
