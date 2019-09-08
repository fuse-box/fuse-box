import { Context } from '../../core/Context';
import { IBundleWriteResponse } from '../../bundle/Bundle';
import * as consolidate from 'consolidate';

export function pluginConsolidate(engine: string, options: any) {
  return async (ctx: Context) => {
    ctx.ict.waitFor(
      'before_webindex_write',
      async (props: { filePath: string; fileContents: string; bundles: Array<IBundleWriteResponse> }) => {
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
      },
    );
  };
}
