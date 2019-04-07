import * as prettyTime from 'pretty-time';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { createDevBundles, inflateBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { attachHMR } from '../hmr/attach_hmr';
import { pluginDevJs } from '../plugins/core/plugin_dev_js';
import { pluginTypescript } from '../plugins/core/plugin_typescript';
import { assemble } from './assemble';
import { attachCache } from './attach_cache';
import { attachPlugins } from './attach_plugins';
import { attachWatcher } from './attach_watcher';
import { attachWebIndex } from './attach_webIndex';
import { statLog } from './stat_log';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;
  const startTime = process.hrtime();

  attachCache(ctx);
  attachHMR(ctx);

  const packages = assemble(ctx, ctx.config.options.entries[0]);

  await attachPlugins({
    ctx: ctx,
    packages: packages,
    plugins: [...ctx.config.plugins, pluginDevJs(), pluginTypescript()],
  });
  // sorting bundles with dev, system, default, vendor
  const data = createDevBundles(ctx, packages);
  // inflation (populating the contents)
  inflateBundles(ctx, data.bundles);

  const writers = [];
  for (const key in data.bundles) {
    const bundle = data.bundles[key];
    writers.push(() => bundle.generate().write());
  }
  const bundles: Array<IBundleWriteResponse> = await Promise.all(writers.map(i => i()));

  await attachWebIndex(ctx, bundles);

  attachWatcher({ ctx });

  ctx.log.stopSpinner();

  statLog({
    printFuseBoxVersion: true,
    printPackageStat: true,
    ctx: ctx,
    packages: packages,
    time: prettyTime(process.hrtime(startTime)),
  });

  ict.sync('complete', { ctx: ctx, bundles: bundles });
}
