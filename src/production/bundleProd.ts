import { Context } from '../core/Context';
import { assemble } from '../main/assemble';
import { prerequisites } from '../main/prerequisite';
import { processPlugins } from '../main/process_plugins';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { Engine } from './engine';
import { ProductionContext } from './ProductionContext';

export async function bundleProd(ctx: Context) {
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

  const context = ProductionContext(ctx, packages);

  await Engine(context).start();

  ctx.log.fuseFinalise();
}
