import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';

export async function attachWebIndex(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  if (ctx.webIndex.isDisabled) {
    return;
  }
  await ctx.webIndex.generate(bundles);
}
