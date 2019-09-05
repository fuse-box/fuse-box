import { createStylesheetProps } from '../../config/createStylesheetProps';
import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { IPluginCommon } from '../interfaces';
import { parsePluginOptions } from '../pluginUtils';
import { cssContextHandler } from './shared';
import { stylusHandler } from '../../stylesheet/stylus/stylusHandler';

export function pluginStylusCapture(props: { ctx: Context; module: Module; opts: IPluginCommon }) {
  const { ctx, module, opts } = props;

  if (!ctx.isInstalled('stylus')) {
    ctx.fatal(`Fatal error when capturing ${module.props.absPath}`, [
      'Module "stylus" is required, Please install it using the following command',
      'npm install stylus --save-dev',
    ]);
    return;
  }

  ctx.log.info('stylus', module.props.absPath);

  props.module.read();
  props.module.captured = true;

  const stylusProcessor = stylusHandler({ ctx: ctx, module, options: opts.stylesheet });
  if (!stylusProcessor) return;

  // A shared handler that takes care of development/production render
  // as well as setting according flags
  // It also accepts extra properties (like asText) to handle text rendering
  cssContextHandler({
    ctx,
    module: module,
    options: opts.stylesheet,
    processor: stylusProcessor,
    shared: opts,
  });
}

export function pluginStylus(a?: IPluginCommon | string | RegExp, b?: IPluginCommon) {
  return (ctx: Context) => {
    let [opts, matcher] = parsePluginOptions<IPluginCommon>(a, b, {});

    opts.stylesheet = createStylesheetProps({ ctx, stylesheet: opts.stylesheet || {} });

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured || !matcher) {
        return;
      }

      if (matcher.test(module.props.absPath)) {
        pluginStylusCapture({ ctx, module, opts: opts });
      }
      return props;
    });
  };
}
