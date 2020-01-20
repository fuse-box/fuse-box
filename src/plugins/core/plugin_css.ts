import { createStylesheetProps } from '../../config/createStylesheetProps';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { ImportType } from '../../resolver/resolver';
import { cssResolveURL } from '../../stylesheet/cssResolveURL';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';
import { resolve } from '../../ModuleResolver/ModuleResolver';
import { IModule } from '../../ModuleResolver/Module';

export interface ICSSPluginProps {
  stylesheet?: IStyleSheetProps;
  asText?: boolean;
}
export function pluginCSS(a?: ICSSPluginProps | string | RegExp, b?: ICSSPluginProps) {
  let [opts, matcher] = parsePluginOptions<ICSSPluginProps>(a, b, {});
  if (!matcher) matcher = /\.(css)$/;
  return (ctx: Context) => {
    let styleSheetModule: IModule;
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });
    if (!ctx.config.production && ctx.config.supportsStylesheet()) {
      ctx.ict.on('module_init', props => {
        const { module, bundleContext } = props;
        if (!module.isStylesheet) return;
        // we need to resolve it only once
        if (styleSheetModule) {
          module.storage.styleSheetModule = styleSheetModule;
          return;
        }
        // retriving the module
        styleSheetModule = resolve({
          bundleContext,
          ctx,
          importType: ImportType.REQUIRE,
          parent: module,
          statement: 'fuse-box-css',
        });
        module.storage.styleSheetModule = styleSheetModule;

        return props;
      });
    }

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;

      if (!matcher.test(module.absPath) || props.module.captured) return;
      ctx.log.info('css', module.absPath);
      module.read();

      props.module.captured = true;

      cssContextHandler({
        ctx,
        module: module,
        options: opts.stylesheet,
        processor: {
          render: async () => {
            const urlResolver = cssResolveURL({
              filePath: module.absPath,
              ctx: ctx,
              contents: module.contents,
              options: ctx.config.stylesheet,
            });
            return { css: urlResolver.contents };
          },
        },
        shared: { asText: opts.asText },
      });

      return props;
    });
  };
}
