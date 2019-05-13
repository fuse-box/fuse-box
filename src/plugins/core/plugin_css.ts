import { Context } from '../../core/Context';
import { ImportType } from '../../resolver/resolver';
import { cssResolveURL } from '../../stylesheet/cssResolveURL';
import { cssDevModuleRender } from '../../stylesheet/cssDevModuleRender';

export function pluginCSS() {
  return (ctx: Context) => {
    if (!ctx.config.production) {
      ctx.ict.on('assemble_module_init', props => {
        const { module } = props;
        if (module.isStylesheet()) {
          module.fastAnalysis = { imports: [] };
          module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: 'fuse-box-css' });
        }
        return props;
      });
    }

    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;

      if (!module.captured && module.props.extension === '.css') {
        ctx.log.verbose('<cyan><bold>CSS:</bold> Captured $file with default css plugin</cyan>', {
          file: module.props.absPath,
        });
        module.read();
        const urlResolver = cssResolveURL({
          filePath: module.props.absPath,
          ctx: ctx,
          contents: module.contents,
          options: ctx.config.stylesheet,
        });
        if (!ctx.config.production) {
          cssDevModuleRender({ data: { css: urlResolver.contents }, ctx, options: ctx.config.stylesheet, module });
        }
      }
      return props;
    });
  };
}
