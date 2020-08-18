import { Context } from '../../core/context';
import { isNodeModuleInstalled } from '../../utils/utils';
import { getPackageManagerData } from '../../env';

export function pluginConsolidate(engine: string, options: any) {
  return async (ctx: Context) => {
    if (!isNodeModuleInstalled('consolidate')) {
      ctx.fatal(`Fatal error when trying to use  pluginConsolidate`, [
        'Module "consolidate" is required, Please install it using the following command',
        `${getPackageManagerData().installDevCmd} consolidate`,
      ]);
    }
    const consolidate = require('consolidate');

    ctx.ict.waitFor('before_webindex_write', async props => {
      if (typeof consolidate[engine] !== 'function') {
        ctx.fatal(`The template engine you selected is not available in consolidate: ${engine}`);
      }

      try {
        const processedTemplate = await consolidate[engine](props.filePath, {
          ...options,
          bundles: props.bundles,
        });
        props.fileContents = processedTemplate;
      } catch (e) {
        ctx.fatal('Error processing the web-index template using consolidate.', [e.message]);
      }
      return props;
    });
  };
}
