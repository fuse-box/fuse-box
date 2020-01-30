import { IBundleWriteResponse } from '../bundle/bundle';
import { createBundleRouter } from '../bundle/bundleRouter';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { ModuleResolver } from '../moduleResolver/moduleResolver';

export interface IBundleDevResponse {
  bundleContext?: IBundleContext;
  bundles: Array<IBundleWriteResponse>;
  entries?: Array<IModule>;
  modules?: Array<IModule>;
}
export async function bundleDev(props: { ctx: Context; rebundle?: boolean }): Promise<IBundleDevResponse> {
  const { ctx, rebundle } = props;
  ctx.log.startStreaming();
  ctx.log.startTimeMeasure();
  ctx.log.flush();
  ctx.isWorking = true;
  const ict = ctx.ict;

  const { bundleContext, entries, modules } = ModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);
    await ict.resolve();
    const bundles = await router.writeBundles();

    if (bundleContext.cache) bundleContext.cache.write();
    ctx.isWorking = false;
    const response = { bundleContext, bundles, entries, modules };
    ict.sync(rebundle ? 'rebundle' : 'complete', response);
    return response;
  }
}
