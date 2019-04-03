import * as prettyTime from 'pretty-time';
import { createDevBundles, inflateBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { env } from '../core/env';
import { extractFuseBoxPath } from '../utils/utils';
import { createWatcher, WatcherAction } from '../watcher/watcher';
import { assemble } from './assemble';
import { pluginProcessPackages } from './attach_plugins';
import { statLog } from './stat_log';
import { BundleType } from '../bundle/Bundle';
import { spawn } from 'child_process';
import { EMOJIS } from '../logging/logging';
export interface IWatcherAttachProps {
  ctx: Context;
}

interface OnWatcherProps {
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

async function appReload(props: IAppReloadProps) {
  const watcher = props.watcherProps;
  const ctx = watcher.ctx;
  const file = watcher.file;

  // remove objects from assemble context
  // in order to start over
  ctx.assembleContext.flush();
  // nuke all files, all objects in memory
  if (props.nukeAllCache) {
    ctx.cache.nukeAll();
  } else if (props.nukePackageCache) {
    ctx.cache.nukePackageCache();
  } else if (props.nukeProjectCache) {
    ctx.cache.nukePackageCache();
  }

  const spinner = ctx.log.withSpinner();
  spinner.start();

  const startTime = process.hrtime();

  const packages = assemble(ctx, ctx.config.options.entries[0]);
  await pluginProcessPackages({ ctx, packages });
  // sorting bundles with dev, system, default, vendor
  const data = createDevBundles(ctx, packages);
  // inflation (populating the contents)
  inflateBundles(ctx, data.bundles);
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
  await Promise.all(writers.map(i => i()));
  spinner.stop();

  statLog({
    ctx: ctx,
    packages: packages,
    time: prettyTime(process.hrtime(startTime)),
  });
}
async function reload_SoftFromEntry(props: OnWatcherProps) {
  await appReload({ watcherProps: props, writeOnlyProject: true });
}

async function reload_HardModules(props: OnWatcherProps) {
  await appReload({ watcherProps: props, nukePackageCache: false, writeOnlyVendor: true });
}

async function reload_Process(props: OnWatcherProps) {
  const ctx = props.ctx;
  const log = ctx.log;
  log.print(`<bold><yellow>${EMOJIS.warning} Configuration changed, restart required</yellow></bold>`);
  if (ctx.cache) {
    ctx.cache.nukeAll();
    log.print(`<bold><yellow>${EMOJIS.warning} Cache has been cleared</yellow></bold>`);
  }
  log.printNewLine();
  process.exit();
}

async function reload_hardAll(props: OnWatcherProps) {}

async function onWatcherEvent(props: OnWatcherProps) {
  const log = props.ctx.log;
  const shortPath = props.file && extractFuseBoxPath(env.APP_ROOT, props.file);
  if (props.action == WatcherAction.RELOAD_ONE_FILE) {
    log.print('<bold><dim>Soft Reload: $file</dim></bold>', { file: shortPath });
    await reload_SoftFromEntry(props);
  } else if (props.action === WatcherAction.HARD_RELOAD_MODULES) {
    await reload_HardModules(props);
  } else if (props.action == WatcherAction.RESTART_PROCESS) {
    reload_Process(props);
  }
}

export function attachWatcher(props: IWatcherAttachProps) {
  const ctx = props.ctx;
  const config = ctx.config;
  if (!config.options.watcherEnabled) {
    return;
  }

  createWatcher(
    {
      ctx: ctx,
      onEvent: async (a, f) => {
        onWatcherEvent({ action: a, file: f, ctx });
      },
    },
    config.options.watcherProps,
  );
}
