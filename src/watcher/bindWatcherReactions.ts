import * as path from 'path';
import { Context } from '../core/context';
import { bundleDev } from '../development/bundleDev';
import { env } from '../env';
import { WatcherReaction } from './watcher';
export function bindWatcherReactions(ctx: Context) {
  const ict = ctx.ict;

  const RebundleReactions = [
    WatcherReaction.TS_CONFIG_CHANGED,
    WatcherReaction.PACKAGE_LOCK_CHANGED,
    WatcherReaction.FUSE_CONFIG_CHANGED,
    WatcherReaction.PROJECT_FILE_CHANGED,
  ];
  ict.on('watcher_reaction', ({ reactionStack }) => {
    for (const item of reactionStack) {
      if (RebundleReactions.includes(item.reaction)) {
        ctx.log.clearConsole();
        ctx.log.line();
        ctx.log.info('changed', `<dim>$file</dim>`, {
          file: path.relative(env.APP_ROOT, item.absPath),
        });

        bundleDev({ ctx, rebundle: true });
      }
    }
  });
}
