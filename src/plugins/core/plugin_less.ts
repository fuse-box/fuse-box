import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { lessHandler } from '../../stylesheet/less/lessHandler';
import { isNodeModuleInstalled } from '../../utils/utils';
import { IPluginCommon } from '../interfaces';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';
import { getPackageManagerData } from '../../env';

export function pluginLessCapture(props: { ctx: Context; module: IModule; opts: IPluginCommon }) {
  const { ctx, module, opts } = props;
  if (!isNodeModuleInstalled('less')) {
    ctx.fatal(`Fatal error when capturing ${module.absPath}`, [
      'Module "less" is required, Please install it using the following command',
      `${getPackageManagerData().installDevCmd} less`,
    ]);
    return;
  }

  ctx.log.info('less', module.absPath);

  props.module.read();
  props.module.captured = true;

  const postCSS = lessHandler({ ctx: ctx, module, options: opts.stylesheet });
  if (!postCSS) return;

  // A shared handler that takes care of development/production render
  // as well as setting according flags
  // It also accepts extra properties (like asText) to handle text rendering
  cssContextHandler({
    ctx,
    fuseCSSModule: ctx.meta['fuseCSSModule'],
    module: module,
    options: opts.stylesheet,
    processor: postCSS,
    shared: opts,
  });
}

export function pluginLess(a?: IPluginCommon | RegExp | string, b?: IPluginCommon) {
  return (ctx: Context) => {
    let [opts, matcher] = parsePluginOptions<IPluginCommon>(a, b, {});
    if (!matcher) matcher = /\.(less)$/;
    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured || !matcher) {
        return;
      }

      if (matcher.test(module.absPath)) {
        pluginLessCapture({ ctx, module, opts: opts });
      }
      return props;
    });
  };
}
