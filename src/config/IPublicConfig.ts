import { ICache } from '../cache/cache';
import { Context } from '../core/Context';
import { IDevServerProps } from '../devServer/devServerProps';
import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IPluginLinkOptions } from '../plugins/core/plugin_link';
// import { IWatcherExternalProps } from '../watcher/watcher';
import { IWebIndexConfig } from '../webIndex/webIndex';
import { ICodeSplittingConfig } from './ICodeSplittingConfig';
import { IFuseLoggerProps } from './IFuseLoggerProps';
import { IResourceConfig } from './IResourceConfig';
import { IStyleSheetProps } from './IStylesheetProps';
import { IWebWorkerConfig } from './IWebWorkerConfig';
import { ICacheProps, IHMRExternalProps, ITarget } from './PrivateConfig';

export interface IPublicConfig {
  homeDir?: string;
  logging?: IFuseLoggerProps;
  modules?: Array<string>;
  output?: string;
  root?: string;
  target?: ITarget;
  useSingleBundle?: boolean;
  webWorkers?: IWebWorkerConfig;
  dependencies?: {
    ignoreAllExternal?: boolean;
    ignorePackages?: Array<string>;
    include?: Array<string>;
  };

  codeSplitting?: ICodeSplittingConfig;

  // watch?: IWatcherExternalProps | boolean;
  watch?: any | boolean;

  resources?: IResourceConfig;

  json?: IJSONPluginProps;
  link?: IPluginLinkOptions;

  /**
   * Environment variables. Values can be strings only
   * Default values for development and production:
   * NODE_ENV=development|production
   * @type {{ [key: string]: string }}
   * @memberof IPublicConfig
   */
  env?: { [key: string]: string };

  allowSyntheticDefaultImports?: boolean;
  cache?: ICacheProps | boolean;
  entry?: Array<string> | string;
  hmr?: IHMRExternalProps | boolean;
  plugins?: Array<(ctx: Context) => void>;
  sourceMap?:
    | boolean
    | {
        css?: boolean;
        project?: boolean;
        sourceRoot?: string;
        vendor?: boolean;
      };
  stylesheet?: IStyleSheetProps;
  tsConfig?: IRawCompilerOptions | string;
  turboMode?:
    | boolean
    | {
        maxWorkers?: number;
        workerPorts?: Array<number>;
        workerPortsRange?: { end: number; start: number };
      };
  webIndex?: IWebIndexConfig | boolean;
  alias?: { [key: string]: string };

  // read only
  defaultCollectionName?: string;

  devServer?: undefined | IDevServerProps | boolean;

  cacheObject?: ICache;
}
