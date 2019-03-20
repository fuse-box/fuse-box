import { Context } from '../core/Context';
import { assemble } from './assemble';
import { attachPlugins } from './attach_plugins';
import { pluginDevJs } from '../plugins/core/plugin_dev_js';
import { pluginTypescript } from '../plugins/core/plugin_typescript';
import { createDevBundles, inflateBundles } from '../bundle/development/createDevBundles';

export async function runDevelopmentBundles(ctx: Context) {
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
}
