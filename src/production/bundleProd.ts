import { Context } from '../core/Context';
import { assemble } from '../main/assemble';
import { prerequisites } from '../main/prerequisite';
import { processPlugins } from '../main/process_plugins';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { Engine } from './engine';
import { ProductionContext, IProductionContext } from './ProductionContext';

async function productionContextFlow(ctx: Context): Promise<IProductionContext> {
  prerequisites(ctx);
  ctx.log.startStreaming();

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  const packages = assemble(ctx, ctx.config.entries[0]);

  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });
  }

  return ProductionContext(ctx, packages);
}
export async function bundleProd(ctx: Context) {
  const context = await productionContextFlow(ctx);
  await Engine(context).start();

  ctx.log.fuseFinalise();
}

export async function productionPhases(ctx: Context, phases): Promise<IProductionContext> {
  const context = await productionContextFlow(ctx);
  await Engine(context).startPhases(phases);
  return context;
}
