import * as path from 'path';
import { Context } from '../core/context';
import { bundleDev } from '../development/bundleDev';
import { env } from '../env';

import { isDirectoryEmpty, isPathRelative } from '../utils/utils';
import { ChokidarChangeEvent, WatcherReaction } from './watcher';

// those cached paths will be destroyed by watcher when a change detected
export interface IWatchablePathCacheCollection {
  indexFiles?: any;
}
export const WatchablePathCache: Record<string, IWatchablePathCacheCollection> = {};

// reacting to those events
const WatchableCachePathEvents: Array<ChokidarChangeEvent> = ['addDir', 'unlinkDir', 'add'];

/**
 * If a directory is added or removed that affects tsconfig directory
 * Since it's indexed and cached we need to clear the cache
 * and let the resolver refresh it.
 * @see pathsLookup.ts
 * @param target
 */
function verifyWatchablePaths(target: string) {
  for (let storedPath in WatchablePathCache) {
    const targetDir = path.extname(storedPath) ? path.dirname(storedPath) : storedPath;
    if (isPathRelative(targetDir, target)) WatchablePathCache[storedPath] = undefined;
  }
}
export function bindWatcherReactions(ctx: Context) {
  const ict = ctx.ict;

  const RebundleReactions = [
    WatcherReaction.TS_CONFIG_CHANGED,
    WatcherReaction.PACKAGE_LOCK_CHANGED,
    WatcherReaction.FUSE_CONFIG_CHANGED,
    WatcherReaction.PROJECT_FILE_CHANGED,
  ];

  ict.on('watcher_reaction', ({ reactionStack }) => {
    let lastAbsPath;
    for (const item of reactionStack) {
      if (RebundleReactions.includes(item.reaction)) {
        // we're not interested in re-bunlding if user adds an empty directory
        let isEmpty = item.event === 'addDir' && isDirectoryEmpty(item.absPath);
        if (!isEmpty) lastAbsPath = item.absPath;
      }
      // checking for adding and removing directories
      // and verity cached paths
      // an empty folder is a valid reason for checking too
      if (WatchableCachePathEvents.includes(item.event)) verifyWatchablePaths(item.absPath);
    }
    if (lastAbsPath) {
      ctx.log.info('changed', `$file`, {
        file: path.relative(env.APP_ROOT, lastAbsPath),
      });

      bundleDev({ ctx, rebundle: true });
    }
  });
}
