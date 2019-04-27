import { Context } from '../../core/Context';
import { ImportType } from '../../resolver/resolver';

export function pluginCSS() {
  return (ctx: Context) => {
    if (!ctx.config.production) {
      ctx.ict.on('assemble_module_init', props => {
        if (props.module.isStylesheet()) {
          props.module.fastAnalysis = { imports: [] };
          props.module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: 'fuse-box-css' });
        }
        return props;
      });
    }
  };
}
