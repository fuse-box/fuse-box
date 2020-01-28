import { createBundleRouter } from '../bundle/bundleRouter';
import { Context } from '../core/context';
import { ModuleResolver } from '../moduleResolver/moduleResolver';

import { attachWebIndex } from './attachWebIndex';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;

  const { bundleContext, entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);

    await ict.resolve();
    const bundles = await router.writeBundles();
    await attachWebIndex(ctx, bundles);

    if (bundleContext.cache) bundleContext.cache.write();
    ict.sync('complete', { bundles, ctx });
  }
}
