import * as prettyTime from 'pretty-time';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { createDevBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { attachHMR } from '../hmr/attach_hmr';
import { pluginAssumption } from '../plugins/core/plugin_assumption';
import { pluginCSS } from '../plugins/core/plugin_css';
import { pluginJS } from '../plugins/core/plugin_js';
import { pluginSass } from '../plugins/core/plugin_sass';
import { pluginTypescript } from '../plugins/core/plugin_typescript';
import { attachWebWorkers } from '../web-workers/attachWebWorkers';
import { assemble } from './assemble';
import { attachCache } from './attach_cache';
import { attachWatcher } from './attach_watcher';
import { attachWebIndex } from './attach_webIndex';
import { processPlugins } from './process_plugins';
import { attachServerEntry } from './server_entry';
import { statLog } from './stat_log';

export async function bundleDev(ctx: Context) {
  const ict = ctx.ict;
  const startTime = process.hrtime();

  const plugins = [
    ...ctx.config.plugins,
    pluginAssumption(),
    pluginCSS(),
    pluginJS(),
    pluginSass(),
    pluginTypescript(),
  ];

  plugins.forEach(plugin => plugin && plugin(ctx));

  attachCache(ctx);
  attachHMR(ctx);
  attachWebWorkers(ctx);

  // lib-esm/params/paramTypes.js"

  let bundles: Array<IBundleWriteResponse>;
  const packages = assemble(ctx, ctx.config.entries[0]);
  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });
    // server entry reload
    attachServerEntry(ctx);

    // sorting bundles with dev, system, default, vendor
    const data = createDevBundles(ctx, packages);

    const writers = [];
    for (const key in data.bundles) {
      const bundle = data.bundles[key];
      writers.push(() => bundle.generate().write());
    }
    bundles = await Promise.all(writers.map(i => i()));

    await attachWebIndex(ctx, bundles);

    attachWatcher({ ctx });
  }

  statLog({
    printFuseBoxVersion: true,
    printPackageStat: true,
    ctx: ctx,
    packages: packages,
    time: prettyTime(process.hrtime(startTime), 'ms'),
  });
  if (bundles) {
    ict.sync('complete', { ctx: ctx, bundles: bundles, packages: packages });
  }
}
