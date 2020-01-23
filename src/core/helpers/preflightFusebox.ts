import { env } from '../../env';
import { FuseBoxLogAdapter } from '../../fuseLog/FuseBoxLogAdapter';
import { pluginAssumption } from '../../plugins/core/plugin_assumption';
import { pluginCSS } from '../../plugins/core/plugin_css';
import { pluginSass } from '../../plugins/core/plugin_sass';
import { parseVersion } from '../../utils/utils';
import { Context } from "../Context";
import ts = require('typescript');

export function preflightFusebox(ctx: Context) {
  const log = ctx.log;

  checkVersion(log);

  log.fuseHeader({
    // cacheFolder: ctx.cache && ctx.cache.rootFolder,
    FTL: ctx.cache && ctx.config.cache.FTL,
    entry: ctx.config.entries[0],
    mode: ctx.config.production ? 'production' : 'development',
    version: env.VERSION,
  });

  log.startStreaming();

  const plugins = [...ctx.config.plugins, pluginAssumption(), pluginCSS(), pluginSass()];
  plugins.forEach(plugin => plugin && plugin(ctx));
}


function checkVersion(log: FuseBoxLogAdapter) {
  const nodeVersion = parseVersion(process.version)[0];
  if (nodeVersion < 11) {
    log.warn(
      'You are using an older version of Node.js $version. Upgrade to at least Node.js v11 to get the maximium speed out of FuseBox',
      { version: process.version },
    );
  }
  const tsVersion = parseVersion(ts.version);
  if (tsVersion[0] < 3) {
    log.warn('You are using an older version of TypeScript $version. FuseBox builds might not work properly', {
      version: tsVersion,
    });
  }
}
