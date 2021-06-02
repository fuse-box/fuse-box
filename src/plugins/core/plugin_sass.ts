import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/context';
import { sassHandler } from '../../stylesheet/sassHandler';
import { isNodeModuleInstalled } from '../../utils/utils';
import { IPluginCommon } from '../interfaces';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';
import { getPackageManagerData } from '../../env';

export function pluginSass(a?: IPluginCommon | RegExp | string, b?: IPluginCommon) {
  let [opts, matcher] = parsePluginOptions<IPluginCommon>(a, b, {});
  return (ctx: Context) => {
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });
    if (!matcher) matcher = /\.(scss|sass)$/;
    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;

      if (props.module.captured || !matcher.test(module.absPath)) {
        return;
      }

      if (!isNodeModuleInstalled('node-sass')) {
        ctx.fatal(`Fatal error when capturing ${module.absPath}`, [
          'Module "sass" is required, Please install it using the following command',
          `${getPackageManagerData().installDevCmd} node-sass`,
        ]);

        return;
      }

      ctx.log.info('sass', module.absPath);

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
        fuseCSSModule: ctx.meta['fuseCSSModule'],
        module: module,
        options: opts.stylesheet,
        processor: sass,
        shared: opts,
      });

      return props;
    });
  };
}
