import { Context } from '../core/Context';
import { IBundleWriteResponse, Bundle, BundleType } from '../bundle/Bundle';
import { createServerProcess, IServerProcess } from '../server_process/serverProcess';

export function attachServerEntry(ctx: Context) {
  let serverProcess: IServerProcess;
  async function write(bundles: Array<IBundleWriteResponse>) {
    const info = await devServerEntry(ctx, bundles);
    if (ctx.config.autoStartServerEntry) {
      if (!serverProcess) serverProcess = createServerProcess({ absPath: info.stat.absPath });
      serverProcess.start();
    }
  }
  if (ctx.config.target === 'server' || ctx.config.target === 'universal') {
    ctx.ict.on('complete', props => {
      write(props.bundles);
      return props;
    });

    ctx.ict.on('rebundle_complete', props => {
      write(props.bundles);
      return props;
    });
  }
}

export async function devServerEntry(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  const serverEntry = new Bundle({
    ctx,
    name: '_server_entry',
    priority: -1,
    type: BundleType.SERVER_ENTRY,
    webIndexed: false,
  });

  const sorted = bundles.sort((a, b) => a.bundle.props.priority - b.bundle.props.priority);
  sorted.forEach(bundle => {
    serverEntry.addContent(`require("./${bundle.stat.localPath}")`);
  });
  return await serverEntry.generate().write();
}
