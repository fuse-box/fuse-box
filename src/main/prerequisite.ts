import { Context } from '../core/Context';
import { env } from '../env';

export function prerequisites(ctx: Context) {
  ctx.log.fuseHeader({
    // cacheFolder: ctx.cache && ctx.cache.rootFolder,
    FTL: ctx.cache && ctx.config.cache.FTL,
    entry: ctx.config.entries[0],
    mode: ctx.config.production ? 'production' : 'development',
    version: env.VERSION,
  });
  if (!ctx.tsConfig.tsConfigFilePath) {
    ctx.log.info('tsconfig', 'tsconfig.json was not found. Using internal defaults.');
  }
}
