import { watch as chokidarWatch } from 'chokidar';
import * as path from 'path';
import { Context } from '../core/context';
import { env } from '../env';
import { path2RegexPattern } from '../utils/utils';
import { bindWatcherReactions } from './bindWatcherReactions';
export type IWatcher = ReturnType<typeof createWatcher>;

export enum WatcherReaction {
  UNMATCHED,
  TS_CONFIG_CHANGED,
  FUSE_CONFIG_CHANGED,
  PACKAGE_LOCK_CHANGED,
  PROJECT_FILE_CHANGED,
}

const Reactions = [
  { clearCache: true, reaction: WatcherReaction.TS_CONFIG_CHANGED, test: /tsconfig\.json$/ },
  { reaction: WatcherReaction.PACKAGE_LOCK_CHANGED, test: /(package|yarn)-lock\.json$/ },
  { clearCache: true, reaction: WatcherReaction.FUSE_CONFIG_CHANGED, test: /fuse\.(js|ts)$/ },
];

export type ChokidarChangeEvent = 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir';

export interface Reaction {
  absPath: string;
  event?: ChokidarChangeEvent;
  reaction: WatcherReaction;
}

export type ReactionStack = Array<Reaction>;

export function createWatcher(ctx: Context) {
  const config = ctx.config;
  if (!config.watcher.enabled) return;

  const props = config.watcher;

  const ict = ctx.ict;

  bindWatcherReactions(ctx);

  let includePaths: Array<RegExp> = [];
  let ignorePaths: Array<RegExp> = [];

  if (!props.include) {
    // taking an assumption that the watch directory should be next to the entry point
    const entryPath = path.dirname(ctx.config.entries[0]);
    includePaths.push(path2RegexPattern(entryPath));
  }

  if (!props.ignore) {
    // default ignored paths
    ignorePaths.push(
      /node_modules/,
      /(\/|\\)\./,
      path2RegexPattern('/dist/'),
      path2RegexPattern('/build/'),
      /flycheck_/,
      /~$/,
      /\#.*\#$/,
      path2RegexPattern(ctx.writer.outputDirectory),
    );
  }

  let reactionStack: ReactionStack = [];

  async function waitForContextReady(props: { cancelled?: boolean }, cb: () => void) {
    function awaitContext(resolve) {
      if (ctx.isWorking) {
        setTimeout(() => {
          awaitContext(resolve);
        }, 10);
      } else !props.cancelled && cb();
    }
    awaitContext(cb);
  }

  const awaitProps = { cancelled: false };

  function acceptEvents() {
    ict.sync('watcher_reaction', { reactionStack });
    reactionStack = [];
  }

  let tm;
  function dispatchEvent(event: ChokidarChangeEvent, absPath: string) {
    clearTimeout(tm);

    let projectFilesChanged = false;
    for (const userPath of includePaths) {
      if (userPath.test(absPath)) {
        projectFilesChanged = true;
        break;
      }
    }

    if (projectFilesChanged) reactionStack.push({ absPath, event, reaction: WatcherReaction.PROJECT_FILE_CHANGED });
    for (const x of Reactions) {
      if (x.test.test(absPath)) reactionStack.push({ absPath, reaction: x.reaction });
    }

    awaitProps.cancelled = true;

    // throttle events
    tm = setTimeout(() => {
      awaitProps.cancelled = false;
      waitForContextReady(awaitProps, () => {
        acceptEvents();
      });
    }, 10);
  }

  const self = {
    // initialize the watcher
    init: () => {
      const defaultOpts = {
        awaitWriteFinish: {
          pollInterval: 100,
          stabilityThreshold: 100,
        },
        ignoreInitial: true,
        ignored: ignorePaths,
        interval: 100,
        persistent: true,
      };
      const userOptions = props.chokidarOptions || {};
      const finalOptions = { ...defaultOpts, ...userOptions };

      var watcher = chokidarWatch(env.APP_ROOT, finalOptions);
      watcher.on('all', dispatchEvent);
    },
  };

  ict.on('init', self.init);
  return self;
}
