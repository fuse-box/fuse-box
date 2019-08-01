import * as prettyTime from 'pretty-time';
import { pluginCSS, pluginSass } from '..';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { assemble } from '../main/assemble';
import { attachWebIndex } from '../main/attach_webIndex';
import { processPlugins } from '../main/process_plugins';
import { printStatFinal } from '../main/stat_log';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { attachWebWorkers } from '../web-workers/attachWebWorkers';
import { IProductionResponse, productionMain } from './main';

export async function bundleProd(ctx: Context): Promise<IProductionResponse> {
  ctx.log.print('<yellow><bold>Initiating production build</bold></yellow>');
  ctx.log.printNewLine();
  const startTime = process.hrtime();

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  let bundles: Array<IBundleWriteResponse>;
  attachWebWorkers(ctx);
  const packages = assemble(ctx, ctx.config.entries[0]);

  let data: IProductionResponse;

  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });

    // server entry reload
    // if (ctx.config.isServer()) {
    //   attachServerEntry(ctx);
    // }

    data = await productionMain({ packages, ctx });

    await attachWebIndex(ctx, data.bundles);
  }

  printStatFinal({ log: ctx.log, time: prettyTime(process.hrtime(startTime), 'ms') });
  setTimeout(() => {
    //ctx.log.printNewLine();
    ctx.log.printWarnings();
    ctx.log.printErrors();
  }, 0);
  return data;
}
