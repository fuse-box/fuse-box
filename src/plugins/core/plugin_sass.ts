import { Context } from '../../core/Context';
import { cssDevModuleRender } from '../../stylesheet/cssDevModuleRender';
import { sassHandler } from '../../stylesheet/sassHandler';

export function pluginSass() {
  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (props.module.captured) {
        return;
      }

      if (['.scss', '.sass'].includes(module.props.extension)) {
        ctx.log.verbose('<cyan><bold>SASS:</bold> Captured $file with <bold>sassPlugin</bold> plugin</cyan>', {
          file: module.props.absPath,
        });
        props.module.read();
        props.module.captured = true;

        const sass = sassHandler({ ctx: ctx, module, options: ctx.config.stylesheet });
        if (!sass) return;

        // development mode
        // render without blocking and creating a special content
        if (!ctx.config.production) {
          ctx.ict.promise(async () => {
            try {
              const data = await sass.render();

              cssDevModuleRender({ data, ctx, options: ctx.config.stylesheet, module });
            } catch (e) {
              console.log(e.stack);
              ctx.log.error('$error in $file', {
                error: e.message,
                file: module.props.absPath,
              });
            }
          });
        }
      }
      return props;
    });
  };
}
