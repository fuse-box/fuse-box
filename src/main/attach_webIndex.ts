import { Context } from '../core/Context';
import { IBundleWriteResponse } from '../bundle_new/Bundle';

export async function attachWebIndex(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  if (ctx.webIndex.isDisabled) {
    return;
  }
  await ctx.webIndex.generate(bundles);
}
