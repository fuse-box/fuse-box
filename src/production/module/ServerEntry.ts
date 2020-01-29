import { BundleType, createBundle, IBundleWriteResponse } from '../../bundle/bundle';
import { Context } from '../../core/context';

export async function createServerEntry(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  const serverEntryFileName = ctx.outputConfig.serverEntry || 'serverEntry.js';
  const serverEntry = createBundle({
    bundleConfig: {
      path: serverEntryFileName,
    },
    ctx,
    fileName: serverEntryFileName,
    type: BundleType.JS_APP,
    webIndexed: false,
  });
  serverEntry.prepare();
  serverEntry.contents = '';
  const sorted = bundles.sort((a, b) => a.bundle.priority - b.bundle.priority);
  const bundlesLength = bundles.length;
  let index = 0;
  while (index < bundlesLength) {
    serverEntry.contents += `require("./${sorted[index].relativePath}");\n`;
    index++;
  }
  return await serverEntry.write();
}
