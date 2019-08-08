import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/Context';
import { postCSSHandler } from '../../stylesheet/postcss/postcssHandler';
import { IPluginCommon } from '../interfaces';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';

export function pluginPostCSS({ a, b }: { a?: IPluginCommon | string | RegExp; b?: IPluginCommon } = {}) {
  return (ctx: Context) => {
    let [opts, matcher] = parsePluginOptions<IPluginCommon>(a, b, {});

    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured || !matcher) {
        return;
      }

      if (matcher.test(module.props.absPath)) {
        ctx.log.progressFormat('pluginPostCSS', module.props.absPath);

        props.module.read();
        props.module.captured = true;

        const postCSS = postCSSHandler({ ctx: ctx, module, options: opts.stylesheet });
        if (!postCSS) return;

        // A shared handler that takes care of development/production render
        // as well as setting according flags
        // It also accepts extra properties (like asText) to handle text rendering
        cssContextHandler({
          ctx,
          module: module,
          options: opts.stylesheet,
          processor: postCSS,
          shared: { asText: opts.asText, useDefault: opts.useDefault },
        });
      }
      return props;
    });
  };
}
