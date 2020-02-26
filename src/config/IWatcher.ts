import { WatchOptions } from 'chokidar';

export interface IWatcherPublicConfig {
  chokidarOptions?: WatchOptions;
  enabled?: boolean;
  ignore?: Array<string | RegExp>;
  include?: Array<string | RegExp>;
  /**
   * The root folder(s) to watch
   * Passed to chokidar as paths
   */
  root?: string | string[];
}
