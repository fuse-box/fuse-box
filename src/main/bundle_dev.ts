import { IBundleWriteResponse } from '../bundle/Bundle';
import { createDevBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { attachHMR } from '../hmr/attach_hmr';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { assemble } from './assemble';
import { attachCache } from './attach_cache';
import { attachWatcher } from './attach_watcher';
import { attachWebIndex } from './attach_webIndex';
import { prerequisites } from './prerequisite';
import { processPlugins } from './process_plugins';
import { addServerEntry } from './server_entry';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;

  ctx.log.startStreaming();
  prerequisites(ctx);

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  attachCache(ctx);

  attachHMR(ctx);

  // lib-esm/params/paramTypes.js"

  let bundles: Array<IBundleWriteResponse>;
  const packages = assemble(ctx, ctx.config.entries[0]);
  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });

    // sorting bundles with dev, system, default, vendor
    const data = createDevBundles(ctx, packages);

    const writers = [];
    for (const key in data.bundles) {
      const bundle = data.bundles[key];
      writers.push(() => bundle.generate().write());
    }
    bundles = await Promise.all(writers.map(i => i()));

    await attachWebIndex(ctx, bundles);

    attachWatcher({ ctx });
  }

  ctx.log.stopStreaming();
  ctx.log.fuseFinalise();

  if (bundles) {
    if (ctx.config.isServer()) {
      const serverEntryBundle = await addServerEntry(ctx, bundles);
      bundles.push(serverEntryBundle.info);
    }
    ict.sync('complete', { ctx: ctx, bundles: bundles, packages: packages });
  }
}
