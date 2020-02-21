import { IRunResponse } from '../core/IRunResponse';
import { Context } from '../core/context';
import { createProductionContext } from './ProductionContext';
import { Engine } from './engine';

export async function bundleProd(ctx: Context): Promise<IRunResponse> {
  ctx.log.startStreaming();
  const context = await createProductionContext(ctx);
  await Engine(context).start();
  ctx.log.stopStreaming();
  return context.runResponse;
}
