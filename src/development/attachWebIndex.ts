import { IBundleWriteResponse } from '../bundle/bundle';
import { Context } from '../core/context';

export async function attachWebIndex(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  if (ctx.webIndex.isDisabled) {
    return;
  }
  await ctx.webIndex.generate(bundles);
}
