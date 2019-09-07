import { minifyHTMLLiterals } from 'minify-html-literals';
import { Context } from '../../core/Context';

export function pluginMinifyHtmlLiterals(...options: any) {
  const useroptions = options;
  return (ctx: Context) => {
    ctx.ict.on('assemble_fast_analysis', props => {
      const { module } = props;
      if (module.props && (module.props.extension === '.ts' || module.props.extension === '.js')) {
        if (module.contents.indexOf('html`') !== -1 || module.contents.indexOf('css`') !== -1) {
          ctx.log.info('pluginMinifyHtmlLiterals', 'minifying $file', {
            file: module.props.absPath,
          });

          // https://github.com/asyncLiz/minify-html-literals
          let newcontent;
          try {
            newcontent = minifyHTMLLiterals(module.contents, ...useroptions);
          } catch {}

          if (newcontent && newcontent.code) {
            module.contents = newcontent.code;
          } else {
            ctx.log.error('pluginMinifyHtmlLiterals - failed $file', {
              file: module.props.absPath,
            });
          }
        }
      }
      return props;
    });
  };
}
