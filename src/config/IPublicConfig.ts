import { Cache } from '../cache/cache';
import { Context } from '../core/Context';
import { IDevServerProps } from '../dev-server/devServerProps';
import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { ILoggerProps } from '../logging/logging';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IWatcherExternalProps } from '../watcher/watcher';
import { IWebIndexConfig } from '../web-index/webIndex';
import { ICodeSplittingConfig } from './ICodeSplittingConfig';
import { IResourceConfig } from './IResourceConfig';
import { IStyleSheetProps } from './IStylesheetProps';
import { IWebWorkerConfig } from './IWebWorkerConfig';
import { ICacheProps, IHMRExternalProps, ITarget } from './PrivateConfig';
import { IPluginLinkOptions } from '../plugins/core/plugin_link';
export interface IPublicConfig {
  root?: string;
  target?: ITarget;
  autoStartServerEntry?: boolean;
  autoStartEntry?: boolean;
  useSingleBundle?: boolean;
  dependencies?: {
    include?: Array<string>;
    ignore?: Array<string>;
    ignoreAllExternal?: boolean;
  };
  homeDir?: string;
  output?: string;
  modules?: Array<string>;
  logging?: ILoggerProps;
  webWorkers?: IWebWorkerConfig;

  codeSplitting?: ICodeSplittingConfig;

  watch?: boolean | IWatcherExternalProps;

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

  hmr?: boolean | IHMRExternalProps;
  stylesheet?: IStyleSheetProps;
  cache?: boolean | ICacheProps;
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

  devServer?: IDevServerProps | boolean | undefined;

  cacheObject?: Cache;
}
