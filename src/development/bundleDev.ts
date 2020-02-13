import { createBundleRouter } from '../bundle/bundleRouter';
import { IRunResponse } from '../core/IRunResponse';
import { Context } from '../core/context';
import { createRunResponse } from '../core/runResponse';
import { ModuleResolver } from '../moduleResolver/moduleResolver';

export async function bundleDev(props: { ctx: Context; rebundle?: boolean }): Promise<IRunResponse> {
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

    const { bundles, manifest, onComplete } = await createRunResponse(ctx, router);

    if (bundleContext.cache) await bundleContext.cache.write();
    ctx.isWorking = false;

    const response: IRunResponse = {
      bundleContext,
      bundles,
      entries,
      manifest,
      modules,
      onComplete,
    };

    ict.sync(rebundle ? 'rebundle' : 'complete', response);
    return response;
  }
}
