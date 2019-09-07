import { Context } from '../../core/Context';

/**
 * See https://github.com/asyncLiz/minify-html-literals after source input
 */
interface IPluginMinifyHtmlLiterals {}

/**
 * Simple plugin to use npm module minify-html-literals
 * @param options
 */
export function pluginMinifyHtmlLiterals(...options: IPluginMinifyHtmlLiterals[]) {
  const useroptions = options;

  return (ctx: Context) => {
    ctx.ict.on('bundle_resolve_module', props => {
      const { module } = props;
      if (module.isExecutable()) {
        // verify if module is installed
        if (!ctx.isInstalled('minify-html-literals')) {
          ctx.fatal(`Fatal error when capturing ${module.props.absPath}`, [
            'Module "minify-html-literals" is required, Please install it using the following command',
            'npm install minify-html-literals --save-dev',
          ]);
          return;
        }

        // check if we have any html`` or css`` template tags
        if (module.contents.indexOf('html`') !== -1 || module.contents.indexOf('css`') !== -1) {
          ctx.log.info('pluginMinifyHtmlLiterals', 'minifying $file', {
            file: module.props.absPath,
          });

          // https://github.com/asyncLiz/minify-html-literals
          let newcontent;
          try {
            const minifyHTMLLiterals = require('minify-html-literals');
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
