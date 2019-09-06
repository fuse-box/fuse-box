import { pluginCSS, pluginSass } from '..';
import { Context } from '../core/Context';
import { assemble } from '../main/assemble';
import { attachWebIndex } from '../main/attach_webIndex';
import { prerequisites } from '../main/prerequisite';
import { processPlugins } from '../main/process_plugins';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { attachWebWorkers } from '../web-workers/attachWebWorkers';
import { IProductionResponse, productionMain } from './main';

export async function bundleProd(ctx: Context): Promise<IProductionResponse> {
  prerequisites(ctx);
  ctx.log.startStreaming();

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  attachWebWorkers(ctx);
  const packages = assemble(ctx, ctx.config.entries[0]);

  let data: IProductionResponse;

  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });

    data = await productionMain({ packages, ctx });

    await attachWebIndex(ctx, data.bundles);
  }

  ctx.log.fuseFinalise();
  return data;
}
