import * as chokidar from 'chokidar';
import * as path from 'path';
import { Context } from '../core/Context';
import { env } from '../env';
import { WatchOptions } from 'chokidar';

type IChokidarEventType = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir' | 'error' | 'ready';

export interface IWatcherExternalProps {
  paths?: any;
  skipRecommendedIgnoredPaths?: boolean;
  ignored?: Array<string | RegExp>;
  banned?: Array<string>;
  chokidar?: WatchOptions;
}

export function attachChokidar(props: {
  root?: string;
  chokidarOptions?: WatchOptions;
  ignored?: Array<string | RegExp>;
  cb: (event: IChokidarEventType, path: string) => void;
}) {
  const defaultOpts = {
    ignoreInitial: true,
    ignored: props.ignored,
    persistent: true,
  };
  const userOptions = props.chokidarOptions || {};
  const finalOptions = { ...defaultOpts, ...userOptions };

  var watcher = chokidar.watch(props.root, finalOptions);
  watcher.on('all', (event, path) => {
    props.cb(event, path);
  });
}

export function ignoredPath2Regex(input: string): RegExp {
  const str = input.replace(/(\/|\\)/g, '(\\/|\\\\)');
  return new RegExp(str);
}

export interface IWatcherProps {
  ctx: Context;
  onEvent: (action: WatcherAction, file?: string) => void;
}

export enum WatcherAction {
  FATAL_ERROR = 'FATAL_ERROR',
  RELOAD_TS_CONFIG = 'RELOAD_TS_CONFIG',
  RELOAD_ONE_FILE = 'RELOAD_ONE_FILE',
  HARD_RELOAD_MODULES = 'HARD_RELOAD_MODULES',
  SOFT_RELOAD_FILES = 'SOFT_RELOAD_FILES',
  HARD_RELOAD_ALL = 'HARD_RELOAD_ALL',
  RESTART_PROCESS = 'RESTART_PROCESS',
}

export function detectAction(file: string, homeDir: string): WatcherAction {
  const isInsideHomeDir = !/\.\./.test(path.relative(homeDir, file));

  if (file === env.SCRIPT_FILE) {
    return WatcherAction.RESTART_PROCESS;
  }
  if (path.basename(file) === 'tsconfig.json') {
    return WatcherAction.RELOAD_TS_CONFIG;
  }
  if (/(package.lock.json|yarn.lock)$/.test(file)) {
    return WatcherAction.HARD_RELOAD_MODULES;
  }
  if (!isInsideHomeDir) {
    return;
  }

  return WatcherAction.RELOAD_ONE_FILE;
}

export function getEventData(props: {
  input: { event: IChokidarEventType; path: string };
  ctx: Context;
}): WatcherAction {
  const evt = props.input.event;
  const file = path.normalize(props.input.path);
  const homeDir = props.ctx.config.homeDir;
  const events = {
    add: () => detectAction(file, homeDir),
    change: () => detectAction(file, homeDir),
    unlink: () => detectAction(file, homeDir),
    addDir: () => detectAction(file, homeDir),
    unlinkDir: () => detectAction(file, homeDir),
    error: () => {},
  };
  if (events[evt]) {
    return events[evt]();
  }
}

export function getRelevantEvent(actions: Array<WatcherAction>) {
  if (actions.includes(WatcherAction.RESTART_PROCESS)) {
    return WatcherAction.RESTART_PROCESS;
  }
  if (actions.includes(WatcherAction.HARD_RELOAD_MODULES)) {
    return WatcherAction.HARD_RELOAD_MODULES;
  }
  if (actions.includes(WatcherAction.RELOAD_TS_CONFIG)) {
    return WatcherAction.RELOAD_TS_CONFIG;
  }
  if (actions.includes(WatcherAction.SOFT_RELOAD_FILES)) {
    return WatcherAction.SOFT_RELOAD_FILES;
  }
  if (actions.includes(WatcherAction.RELOAD_ONE_FILE)) {
    return WatcherAction.RELOAD_ONE_FILE;
  }
}
export interface Watcher {}
export function createWatcher(props: IWatcherProps, externalProps?: IWatcherExternalProps) {
  const ctx = props.ctx;
  const ict = ctx.ict;
  externalProps = externalProps || {};
  const ignored = externalProps.ignored ? externalProps.ignored : [];
  const paths = externalProps.paths ? externalProps.paths : props.ctx.config.homeDir;

  if (!externalProps.skipRecommendedIgnoredPaths) {
    ignored.push('/node_modules/', /(\/|\\)\./, 'dist/', 'build/', props.ctx.writer.outputDirectory);
  }

  const ignoredRegEx: Array<RegExp> = ignored.map(str => (typeof str === 'string' ? ignoredPath2Regex(str) : str));

  //console.log(props.ctx.config.cache.root);
  let events: Array<WatcherAction> = [];
  let tm;

  ict.on('complete', data => {
    attachChokidar({
      root: paths,
      chokidarOptions: externalProps.chokidar,
      ignored: ignoredRegEx,
      cb: (event, path) => {
        clearTimeout(tm);
        const action = getEventData({ input: { event, path }, ctx });
        if (action) {
          events.push(action);
        }
        tm = setTimeout(() => {
          const action = getRelevantEvent(events);
          events = [];
          props.onEvent(action, path);
        }, 50);
      },
    });
    return data;
  });
}
