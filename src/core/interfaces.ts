import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { ILoggerProps } from '../logging/logging';
import { IWebIndexConfig } from '../web-index/webIndex';
import { Context } from './Context';
import { IDevServerProps } from '../dev-server/devServerProps';
import { IWatcherExternalProps } from '../watcher/watcher';
import { IHMRExternalProps } from '../hmr/attach_hmr';

export interface IConfig {
  root?: string;
  target?: 'browser' | 'server' | 'electron' | 'universal';
  homeDir?: string;
  output?: string;
  modules?: Array<string>;
  logging?: ILoggerProps;
  watch?: boolean | IWatcherExternalProps;
  hmr?: boolean | IHMRExternalProps;
  cache?:
    | boolean
    | {
        root?: string;
        enabled?: boolean;
      };
  tsConfig?: string | IRawCompilerOptions;
  entry?: string | Array<string>;
  allowSyntheticDefaultImports?: boolean;
  webIndex?: IWebIndexConfig | boolean;
  turboMode?:
    | {
        maxWorkers?: number;
        workerPortsRange?: { start: number; end: number };
        workerPorts?: Array<number>;
      }
    | boolean;
  sourceMap?:
    | {
        sourceRoot?: string;
        vendor?: boolean;
        project?: boolean;
        css?: boolean;
      }
    | boolean;
  plugins?: Array<(ctx: Context) => void>;
  alias?: { [key: string]: string };

  // read only
  defaultCollectionName?: string;

  production?: {};

  devServer?: IDevServerProps | boolean | undefined;

  // normalised options
  options?: {
    hmrEnabled?: boolean;
    hmrProps?: IHMRExternalProps;
    watcherEnabled?: boolean;
    watcherProps?: IWatcherExternalProps;
    sourceRoot?: string;
    entries?: Array<string>;
    vendorSourceMap?: boolean;
    projectSourceMap?: boolean;
    cssSourceMap?: boolean;
    cacheEnabled?: boolean;
    cacheRoot?: string;
  };
}
