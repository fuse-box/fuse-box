import { Context } from '../Context';

export function finalizeFusebox(ctx: Context) {
  const log = ctx.log;

  log.stopStreaming();
  log.fuseFinalise();
}
