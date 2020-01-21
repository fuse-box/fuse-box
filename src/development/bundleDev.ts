import { BundleRouter } from '../bundle/bundleRouter';
import { Context } from '../core/Context';
import { ModuleResolver } from '../moduleResolver/ModuleResolver';

import { attachWebIndex } from './attachWebIndex';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;

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

  // if (bundles) {
  //   if (ctx.config.isServer()) {
  //     const serverEntryBundle = await addServerEntry(ctx, bundles);
  //     bundles.push(serverEntryBundle.info);
  //   }
  //   ict.sync('complete', { ctx: ctx, bundles: bundles, packages: packages });
  // }
}
