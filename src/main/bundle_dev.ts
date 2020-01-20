import { BundleRouter } from '../bundle_new/BundleRouter';
import { Context } from '../core/Context';
import { attachHMR } from '../hmr/attach_hmr';
import { ModuleResolver } from '../ModuleResolver/ModuleResolver';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginSass } from '../plugins/core/plugin_sass';
import { attachCache } from './attach_cache';
import { attachWebIndex } from './attach_webIndex';
import { prerequisites } from './prerequisite';
export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;

  ctx.log.startStreaming();
  prerequisites(ctx);

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  attachCache(ctx);

  attachHMR(ctx);

  const { modules, entries } = ModuleResolver(ctx, ctx.config.entries[0]);
  if (modules) {
    const router = BundleRouter({ ctx, entries });
    router.dispatchModules(modules);

    await ict.resolve();
    const bundles = await router.writeBundles();
    await attachWebIndex(ctx, bundles);

    ict.sync('complete', { ctx, bundles });
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
