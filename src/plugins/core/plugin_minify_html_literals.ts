import { Context } from '../../core/context';
import { isNodeModuleInstalled } from '../../utils/utils';
import { getPackageManagerData } from '../../env';

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
      if (module.isExecutable) {
        // verify if module is installed
        if (!isNodeModuleInstalled('minify-html-literals')) {
          ctx.fatal(`Fatal error when capturing ${module.absPath}`, [
            'Module "minify-html-literals" is required, Please install it using the following command',
            `${getPackageManagerData()} install minify-html-literals --save-dev`,
          ]);
          return;
        }
        // check if we have any html`` or css`` template tags
        if (/\html`|css`/.test(module.contents)) {
          ctx.log.info('pluginMinifyHtmlLiterals', 'minifying $file', {
            file: module.absPath,
          });
          // https://github.com/asyncLiz/minify-html-literals
          let newcontent;
          try {
            const { minifyHTMLLiterals } = require('minify-html-literals');
            newcontent = minifyHTMLLiterals(module.contents, ...useroptions);
          } catch (e) {
            console.log(e);
          }
          if (newcontent && newcontent.code) {
            module.contents = newcontent.code;
          } else {
            ctx.log.error('pluginMinifyHtmlLiterals - failed $file', {
              file: module.absPath,
            });
          }
        }
      }
      return props;
    });
  };
}
