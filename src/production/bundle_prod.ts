import { pluginCSS, pluginJSON, pluginSass } from '..';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { assemble } from '../main/assemble';
import { processPlugins } from '../main/process_plugins';
import { productionMain } from './main';

export async function bundleProd(ctx: Context) {
  ctx.log.print('<yellow><bold>Initiating production build</bold></yellow>');
  ctx.log.printNewLine();

  const plugins = [...ctx.config.plugins, pluginJSON(), pluginCSS(), pluginSass()];

  plugins.forEach(plugin => plugin && plugin(ctx));

  let bundles: Array<IBundleWriteResponse>;
  const packages = assemble(ctx, ctx.config.entries[0]);

  if (packages) {
    await processPlugins({
      ctx: ctx,
      packages: packages,
    });
    // server entry reload
    // if (ctx.config.isServer()) {
    //   attachServerEntry(ctx);
    // }

    productionMain({ packages, ctx });

    //console.log(packages);

    //await attachWebIndex(ctx, bundles);
  }

  ctx.log.stopSpinner();

  // statLog({
  //   printFuseBoxVersion: true,
  //   printPackageStat: true,
  //   ctx: ctx,
  //   packages: packages,
  //   time: prettyTime(process.hrtime(startTime), 'ms'),
  // });
  // if (bundles) {
  //   ict.sync('complete', { ctx: ctx, bundles: bundles });
  // }
}
