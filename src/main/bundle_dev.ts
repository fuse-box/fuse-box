import { IBundleWriteResponse } from '../bundle/Bundle';
import { createDevBundles, inflateBundles } from '../bundle/createDevBundles';
import { Context } from '../core/Context';
import { pluginDevJs } from '../plugins/core/plugin_dev_js';
import { pluginTypescript } from '../plugins/core/plugin_typescript';
import { assemble } from './assemble';
import { attachPlugins } from './attach_plugins';
import { attachWebIndex } from './attach_webIndex';
import * as prettyTime from 'pretty-time';
export async function bundleDev(ctx: Context) {
  const ict = ctx.interceptor;
  const startTime = process.hrtime();

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

  ctx.log.stopSpinner();

  ctx.log.group('✔');
  ctx.log.info(`Completed in $time`, {
    time: prettyTime(process.hrtime(startTime)),
  });

  let totalFiles = 0;
  packages.forEach(pkg => {
    totalFiles += pkg.modules.length;
  });
  ctx.log.status(`$packages packages with $files files`, {
    packages: packages.length,
    files: totalFiles,
  });

  ict.sync('complete', { ctx: ctx, bundles: bundles });
}
