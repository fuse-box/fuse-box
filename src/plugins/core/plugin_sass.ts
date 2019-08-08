import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/Context';
import { sassHandler } from '../../stylesheet/sassHandler';
import { IPluginCommon } from '../interfaces';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';

export function pluginSass(a?: IPluginCommon | string | RegExp, b?: IPluginCommon) {
  return (ctx: Context) => {
    let [opts, matcher] = parsePluginOptions<IPluginCommon>(a, b, {});

    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured) {
        return;
      }

      if (!matcher) matcher = /\.(scss|sass)$/;

      if (matcher.test(module.props.absPath)) {
        ctx.log.progressFormat('pluginSass', module.props.absPath);

        props.module.read();
        props.module.captured = true;
        const sass = sassHandler({ ctx: ctx, module, options: opts.stylesheet });
        if (!sass) return;

        // A shared handler that takes care of development/production render
        // as well as setting according flags
        // It also accepts extra properties (like asText) to handle text rendering
        // Accepts postCSS Processor as well
        cssContextHandler({
          ctx,
          module: module,
          options: opts.stylesheet,
          processor: sass,
          shared: { asText: opts.asText, useDefault: opts.useDefault },
        });
      }
      return props;
    });
  };
}
