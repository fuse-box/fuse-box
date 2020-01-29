import { createBundleRouter } from '../bundle/bundleRouter';
import { Context } from '../core/context';
import { ModuleResolver } from '../moduleResolver/moduleResolver';

export async function bundleDev(props: { ctx: Context; rebundle?: boolean }) {
  const { ctx, rebundle } = props;
  ctx.log.startStreaming();
  ctx.log.startTimeMeasure();
  ctx.isWorking = true;
  const ict = ctx.ict;

  const { bundleContext, entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);
    await ict.resolve();
    const bundles = await router.writeBundles();

    if (bundleContext.cache) bundleContext.cache.write();

    ict.sync(rebundle ? 'rebundle' : 'complete', { bundles });
    ctx.isWorking = false;
  }
}
