import { WatchOptions } from 'chokidar';

export interface IWatcherPublicConfig {
  chokidarOptions?: WatchOptions;
  enabled?: boolean;
  ignore?: Array<string | RegExp>;
  include?: Array<string | RegExp>;
}
