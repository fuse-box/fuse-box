import { BundleType, IBundleWriteResponse } from '../bundle/Bundle';
import { createDevBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { env } from '../env';
import { EMOJIS } from '../logging/logging';
import { extractFuseBoxPath } from '../utils/utils';
import { createWatcher, WatcherAction } from '../watcher/watcher';
import { assemble } from './assemble';
import { pluginProcessPackages } from './process_plugins';
export interface IWatcherAttachProps {
  ctx: Context;
}

export interface OnWatcherProps {
  action: WatcherAction;
  file: string;
  ctx: Context;
}

interface IAppReloadProps {
  nukeAllCache?: boolean;
  nukeProjectCache?: boolean;
  nukePackageCache?: boolean;
  writeOnlyProject?: boolean;
  writeOnlyVendor?: boolean;
  watcherProps: OnWatcherProps;
}
interface IAppReloadResponse {
  bundles: Array<IBundleWriteResponse>;
  packages: Array<Package>;
}

async function appReload(props: IAppReloadProps): Promise<IAppReloadResponse> {
  const watcher = props.watcherProps;
  const ctx = watcher.ctx;

  ctx.log.startTimeMeasure();

  if (props.watcherProps.file) {
    const softReloadContext = {
      FTL: false,
      watcherProps: props.watcherProps,
      filePath: props.watcherProps.file,

      timeStart: process.hrtime(),
    };

    ctx.ict.sync('soft_relod', { info: softReloadContext });
    if (softReloadContext.FTL) {
      return;
    }
  }

  // nuke all files, all objects in memory
  if (props.nukeAllCache) {
    ctx.log.info('cache', 'nuke cache');
    ctx.cache.nukeAll();
  } else if (props.nukePackageCache) {
    ctx.log.info('cache', 'nuke package cache');
    ctx.cache.nukePackageCache();
  } else if (props.nukeProjectCache) {
    ctx.log.info('cache', 'nuke project cache');
    ctx.cache.nukeProjectCache();
  }

  // remove objects from assemble context
  // in order to start over
  ctx.assembleContext.flush();

  // TODO: write only project doesn't work very well
  // in case if everything was cached, then one modules is commented out, and then ucommented again.
  // we need to find a solution here, writing large vendors all over again makes an impact on the peformance

  ctx.log.startStreaming();

  const packages = assemble(ctx, ctx.config.entries[0]);
  await pluginProcessPackages({ ctx, packages });
  // sorting bundles with dev, system, default, vendor
  const data = createDevBundles(ctx, packages);

  const writers = [];
  for (const key in data.bundles) {
    const bundle = data.bundles[key];
    // only need to reload the application
    if (props.writeOnlyProject) {
      if (bundle.props.type === BundleType.PROJECT_JS) {
        writers.push(() => bundle.generate().write());
      }
    } else if (props.writeOnlyProject) {
      if (bundle.props.type === BundleType.VENDOR_JS) {
        writers.push(() => bundle.generate().write());
      }
    } else {
      writers.push(() => bundle.generate().write());
    }
  }

  const bundleResponse = await Promise.all(writers.map(i => i()));
  ctx.log.stopStreaming();
  ctx.log.info('reload', 'Completed');
  ctx.log.line();
  ctx.log.fuseFinalise();
  return { bundles: bundleResponse, packages };
}
async function reload_SoftFromEntry(props: OnWatcherProps): Promise<IAppReloadResponse> {
  return await appReload({ watcherProps: props, writeOnlyProject: false });
}

async function reload_HardModules(props: OnWatcherProps): Promise<IAppReloadResponse> {
  return await appReload({ watcherProps: props, nukePackageCache: false, writeOnlyVendor: true });
}

async function reload_Process(props: OnWatcherProps) {
  const ctx = props.ctx;
  const log = ctx.log;
  log.echo(`<bold><yellow>${EMOJIS.warning} Configuration changed, restart required</yellow></bold>`);
  if (ctx.cache) {
    ctx.cache.nukeAll();
    log.echo(`<bold><yellow>${EMOJIS.warning} Cache has been cleared</yellow></bold>`);
  }

  process.exit(0);
}

async function onWatcherEvent(props: OnWatcherProps) {
  const log = props.ctx.log;

  const shortPath = props.file && extractFuseBoxPath(env.APP_ROOT, props.file);

  let response: IAppReloadResponse;
  if (props.action == WatcherAction.RELOAD_ONE_FILE) {
    log.fuseReloadHeader();
    log.info('changed', '<dim>$file</dim>', { file: shortPath });

    response = await reload_SoftFromEntry(props);
  } else if (props.action === WatcherAction.HARD_RELOAD_MODULES) {
    log.fuseReloadHeader();
    log.info('hard reload', '$file', { file: shortPath });

    response = await reload_HardModules(props);
  } else if (props.action == WatcherAction.RESTART_PROCESS) {
    reload_Process(props);
  }
  if (response) {
    props.ctx.ict.sync('rebundle_complete', {
      ctx: props.ctx,
      watcherAction: props.action,
      bundles: response.bundles,
      packages: response.packages,
      file: props.file,
    });
  }
}

export function attachWatcher(props: IWatcherAttachProps) {
  const ctx = props.ctx;
  const config = ctx.config;
  if (!config.watch.enabled) {
    return;
  }

  let inProgress = false;
  createWatcher(
    {
      ctx: ctx,
      onEvent: async (a, f) => {
        if (inProgress) {
          // do not allow another process to kick in
          return;
        }
        props.ctx.log.flush();
        props.ctx.log.clearConsole();
        inProgress = true;
        await onWatcherEvent({ action: a, file: f, ctx });
        inProgress = false;
      },
    },
    config.watch.watcherProps,
  );
}
