import { Context } from '../core/Context';
import { assemble } from './assemble';
import { attachPlugins } from './attach_plugins';
import { pluginDevJs } from '../plugins/core/plugin_dev_js';
import { pluginTypescript } from '../plugins/core/plugin_typescript';
import { createDevBundles, inflateBundles } from '../bundle/createDevBundles';
import { attachWebIndex } from './attach_webIndex';

export async function bundleDev(ctx: Context) {
  console.time('start');
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
  const bundles = await Promise.all(writers.map(i => i()));
  await attachWebIndex(ctx, bundles);

  ctx.log.stopSpinner();

  console.timeEnd('start');
}
