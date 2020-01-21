import { BundleRouter } from '../bundle/bundleRouter';
import { Context } from '../core/Context';
import { prerequisites } from '../main/prerequisite';
import { ModuleResolver } from '../moduleResolver/ModuleResolver';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { ProductionContext, IProductionContext } from './ProductionContext';
import { Engine } from './engine';

async function productionContextFlow(ctx: Context): Promise<IProductionContext> {
  prerequisites(ctx);
  ctx.log.startStreaming();

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  const ict = ctx.ict;

  // const { modules, entries, bundleContext } = ModuleResolver(ctx, ctx.config.entries[0]);
  const { entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    const router = BundleRouter({ ctx, entries });
    router.dispatchModules(modules);

    await ict.resolve();
  }

  return ProductionContext(ctx, modules);
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
