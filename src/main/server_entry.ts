import { Context } from '../core/Context';
import { IBundleWriteResponse, Bundle, BundleType } from '../bundle/Bundle';
import { createServerProcess, IServerProcess } from '../server_process/serverProcess';

export function attachServerEntry(ctx: Context) {
  let serverProcess: IServerProcess;
  async function write(bundles: Array<IBundleWriteResponse>) {
    const data = await addServerEntry(ctx, bundles);

    if (!serverProcess) serverProcess = createServerProcess({ absPath: data.info.stat.absPath });
    serverProcess.start();
  }
  const autoStart =
    ctx.config.autoStartEntry !== undefined
      ? ctx.config.autoStartEntry
      : ctx.config.target === 'server' && ctx.config.autoStartServerEntry !== undefined
      ? ctx.config.autoStartServerEntry
      : false;

  if (autoStart) {
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

export async function addServerEntry(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  const serverEntry = new Bundle({
    ctx,
    name: '_server_entry',
    priority: -1,
    type: BundleType.SERVER_ENTRY,
    webIndexed: false,
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
