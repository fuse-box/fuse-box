import { IRunResponse } from '../core/IRunResponse';
import { createBuild } from '../core/build';
import { Context } from '../core/context';
import { asyncModuleResolver } from '../moduleResolver/asyncModuleResolver';

export async function bundleDev(props: { ctx: Context; rebundle?: boolean }): Promise<IRunResponse> {
  const { ctx, rebundle } = props;
  ctx.log.startStreaming();
  ctx.log.startTimeMeasure();
  ctx.log.flush();
  ctx.isWorking = true;

  const { bundleContext, entries, modules } = await asyncModuleResolver(ctx, ctx.config.entries);
  if (modules) {
    return await createBuild({
      bundleContext,
      ctx,
      entries,
      modules,
      rebundle,
    });
  }
}
