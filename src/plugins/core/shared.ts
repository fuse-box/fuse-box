import * as postcss from 'postcss';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { IModule } from '../../ModuleResolver/Module';
import { cssDevModuleRender } from '../../stylesheet/cssDevModuleRender';
import { IStyleSheetProcessor } from '../../stylesheet/interfaces';
import { IPluginCommon } from '../interfaces';
import { wrapContents } from '../pluginStrings';

export interface ICSSContextHandler {
  ctx: Context;
  processor: IStyleSheetProcessor;
  options: IStyleSheetProps;
  module: IModule;
  shared: IPluginCommon;
}
export function setEmpty() {}

export interface ICreateCSSModule {
  css?: string;
  module: IModule;
  shared: IPluginCommon;
}
async function createCSSModule(props: ICreateCSSModule): Promise<{ json: any; css: string; map: any }> {
  let targetJSON: any;
  return new Promise((resolve, reject) => {
    postcss([
      require('postcss-modules')({
        getJSON: function(cssFileName, json, outputFileName) {
          targetJSON = json;
        },
      }),
    ])
      .process(props.css, {
        from: props.module.absPath,
        to: props.module.absPath,
        map: props.module.isCSSSourceMapRequired && { inline: false },
      })
      .then(result => {
        return resolve({ json: targetJSON, css: result.css, map: result.map });
      });
  });
}
export function cssContextHandler(props: ICSSContextHandler) {
  const { ctx, processor, shared } = props;
  const supported = props.ctx.config.supportsStylesheet() || shared.asText;
  if (!supported) {
    props.module.contents = 'module.exports = {}';
    return;
  }
  if (shared.asModule) {
    if (!ctx.isInstalled('postcss-modules')) {
      ctx.fatal(`Fatal error when capturing ${props.module.absPath}`, [
        'Module "postcss-modules" is required, Please install it using the following command',
        'npm install postcss-modules --save-dev',
      ]);
      return;
    }
  }
  ctx.ict.promise(async () => {
    try {
      // reset errored status
      props.module.errored = false;
      const data = await processor.render();
      const rendererProps = {
        data,
        ctx,
        options: props.options,
        module: props.module,
        useDefault: props.shared.useDefault,
      };

      if (shared.asModule) {
        const result = await createCSSModule({ css: data.css, module: props.module, shared: props.shared });
        data.json = result.json;
        data.map = undefined;
        data.css = result.css;
        props.module.isCSSModule = true;
      } else if (shared.asText) {
        props.module.isCSSText = true;
        props.module.isStylesheet = false;

        props.module.contents = wrapContents(JSON.stringify(data.css), props.shared.useDefault);

        return;
      }
      if (ctx.config.production) {
        props.module.css = data;
        if (shared.asModule && data.json) {
          props.module.contents = wrapContents(JSON.stringify(data.json), props.shared.useDefault);
        }
      } else {
        cssDevModuleRender({ ...rendererProps });
      }
    } catch (e) {
      // prevent module from being cached
      props.module.errored = true;
      let errMessage = e.message ? e.message : `Uknown error in file ${props.module.absPath}`;
      props.module.contents = `console.error(${JSON.stringify(errMessage)})`;
      ctx.log.error('$error in $file', {
        error: e.message,
        file: props.module.absPath,
      });
    }
  });
}
