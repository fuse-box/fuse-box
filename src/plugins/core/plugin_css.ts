import { Context } from '../../core/Context';
import { ISassProps, sassHandler } from '../../stylesheet/sassHandler';

export function pluginCSS() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;

      // filter out non stylesheet and prevent a double capture
      if (!module.isStylesheet() || module.captured) {
        return;
      }

      if (module.props.extension === '.scss') {
        sassHandler({ ctx: ctx, module, options: ctx.config.stylesheet });
      }

      return props;
    });
  };
}
