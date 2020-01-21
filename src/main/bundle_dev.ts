import { BundleRouter } from '../bundle/BundleRouter';
import { Context } from '../core/Context';
import { ModuleResolver } from '../moduleResolver/ModuleResolver';

import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { attachWebIndex } from './attach_webIndex';
import { prerequisites } from './prerequisite';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;

  ctx.log.startStreaming();
  prerequisites(ctx);

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  const { bundleContext, entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    const router = BundleRouter({ ctx, entries });
    router.dispatchModules(modules);

    await ict.resolve();
    const bundles = await router.writeBundles();
    await attachWebIndex(ctx, bundles);

    if (bundleContext.cache) bundleContext.cache.write();

    ict.sync('complete', { bundles, ctx });
    // attachWatcher({ ctx });
  }

  ctx.log.stopStreaming();
  ctx.log.fuseFinalise();

  // if (bundles) {
  //   if (ctx.config.isServer()) {
  //     const serverEntryBundle = await addServerEntry(ctx, bundles);
  //     bundles.push(serverEntryBundle.info);
  //   }
  //   ict.sync('complete', { ctx: ctx, bundles: bundles, packages: packages });
  // }
}
