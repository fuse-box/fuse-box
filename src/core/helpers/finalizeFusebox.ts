import { Context } from '../context';

export function finalizeFusebox(ctx: Context) {
  const log = ctx.log;

  log.stopStreaming();
  log.fuseFinalise();
}
