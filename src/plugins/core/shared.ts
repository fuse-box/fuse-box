import postcss from 'postcss';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { cssDevModuleRender, ICSSModuleRender } from '../../stylesheet/cssDevModuleRender';
import { IStyleSheetProcessor } from '../../stylesheet/interfaces';
import { isNodeModuleInstalled } from '../../utils/utils';
import { IPluginCommon } from '../interfaces';
import { wrapContents } from '../pluginStrings';
import { getPackageManagerData } from '../../env';

export interface ICSSContextHandler {
  ctx: Context;
  fuseCSSModule: IModule;
  module: IModule;
  options: IStyleSheetProps;
  processor: IStyleSheetProcessor;
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
        map: props.module.isCSSSourceMapRequired && { inline: false },
        to: props.module.absPath,
      })
      .then(result => {
        return resolve({ css: result.css, json: targetJSON, map: result.map });
      });
  });
}
export function cssContextHandler(props: ICSSContextHandler) {
  const { ctx, processor, shared } = props;
  const supported = props.ctx.config.supportsStylesheet() || shared.asText || shared.asModule;
  if (!supported) {
    props.module.contents = 'module.exports = {}';
    return;
  }
  if (shared.asModule) {
    if (!isNodeModuleInstalled('postcss-modules')) {
      ctx.fatal(`Fatal error when capturing ${props.module.absPath}`, [
        'Module "postcss-modules" is required, Please install it using the following command',
        `${getPackageManagerData().installDevCmd} postcss-modules`,
      ]);
      return;
    }
  }

  ctx.ict.promise(async () => {
    try {
      // reset errored status
      props.module.errored = false;
      const data = await processor.render();
      const rendererProps: ICSSModuleRender = {
        ctx,
        data,
        fuseCSSModule: props.fuseCSSModule,
        module: props.module,
        options: props.options,
        useDefault: props.shared.useDefault,
      };

      if (shared.asModule) {
        const result = await createCSSModule({ css: data.css, module: props.module, shared: props.shared });
        data.json = result.json;
        data.map = undefined;
        data.css = result.css;
        props.module.isCSSModule = true;
        props.module.breakDependantsCache = true;
      } else if (shared.asText) {
        props.module.isCSSText = true;
        props.module.isStylesheet = false;

        props.module.contents = wrapContents(JSON.stringify(data.css), props.shared.useDefault);

        return;
      }
      if (ctx.config.isProduction) {
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
