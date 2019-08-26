import { Bundle, BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';

export async function addServerEntry(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  const serverEntry = new Bundle({
    ctx,
    name: '_server_entry',
    priority: -1,
    type: BundleType.SERVER_ENTRY,
    webIndexed: false,
    skipHash: true,
  });

  if (ctx.config.sourceMap.project) {
    serverEntry.addContent(`require('source-map-support').install();`);
  }

  const sorted = bundles.sort((a, b) => a.bundle.props.priority - b.bundle.props.priority);
  sorted.forEach(bundle => {
    if (bundle.bundle.props.webIndexed) {
      serverEntry.addContent(`require("./${bundle.stat.localPath}")`);
    }
  });

  const info = await serverEntry.generate().write();

  return { info };
}
