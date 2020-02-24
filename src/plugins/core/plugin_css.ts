import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/context';
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
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });

    if (!ctx.config.isProduction && ctx.config.supportsStylesheet()) {
      ctx.ict.on('module_init', props => {
        const { module } = props;
        if (!module.isStylesheet) return;

        module.resolve({ statement: 'fuse-box-css' }).then(result => {
          ctx.meta['fuseCSSModule'] = result.module;
          return result;
        });

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
        fuseCSSModule: ctx.meta['fuseCSSModule'],
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
