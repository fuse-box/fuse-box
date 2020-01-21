import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/Context';
import { IModule } from '../../moduleResolver/Module';
import { resolve } from '../../moduleResolver/ModuleResolver';
import { ImportType } from '../../resolver/resolver';
import { cssResolveURL } from '../../stylesheet/cssResolveURL';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';

export interface ICSSPluginProps {
  asText?: boolean;
  stylesheet?: IStyleSheetProps;
}
export function pluginCSS(a?: ICSSPluginProps | RegExp | string, b?: ICSSPluginProps) {
  let [opts, matcher] = parsePluginOptions<ICSSPluginProps>(a, b, {});
  if (!matcher) matcher = /\.(css)$/;
  return (ctx: Context) => {
    let styleSheetModule: IModule;
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });
    if (!ctx.config.production && ctx.config.supportsStylesheet()) {
      ctx.ict.on('module_init', props => {
        const { bundleContext, module } = props;
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
              contents: module.contents,
              ctx: ctx,
              filePath: module.absPath,
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
