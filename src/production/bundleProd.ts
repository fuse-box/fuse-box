import { prerequisites } from '../main/prerequisite';
import { Context } from '../core/Context';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { assemble } from '../main/assemble';
import { processPlugins } from '../main/process_plugins';
import { launchFirstStage } from './transformers/stage-1';
import { ProductionContext } from './ProductionContext';

export async function bundleProd(ctx: Context) {
  prerequisites(ctx);
  ctx.log.startStreaming();

  ctx.productionContext = new ProductionContext(ctx);

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  const packages = assemble(ctx, ctx.config.entries[0]);

  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });
  }

  launchFirstStage(ctx, packages);

  ctx.log.fuseFinalise();
}
