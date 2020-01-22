// import { IWatcherExternalProps } from '../watcher/watcher';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { Context } from '../core/Context';
import { IDevServerProps } from '../devServer/devServerProps';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IPluginLinkOptions } from '../plugins/core/plugin_link';
import { IWebIndexConfig } from '../webIndex/webIndex';
import { IFuseLoggerProps } from './IFuseLoggerProps';
import { IResourceConfig } from './IResourceConfig';
import { IStyleSheetProps } from './IStylesheetProps';
import { IWebWorkerConfig } from './IWebWorkerConfig';
import { ICacheProps, IHMRExternalProps, ITarget } from './PrivateConfig';

export interface IPublicConfig {
  compilerOptions?: ICompilerOptions;
  homeDir?: string;
  logging?: IFuseLoggerProps;
  modules?: Array<string>;
  root?: string;
  target?: ITarget;
  webWorkers?: IWebWorkerConfig;
  dependencies?: {
    ignoreAllExternal?: boolean;
    ignorePackages?: Array<string>;
    include?: Array<string>;
  };

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

  webIndex?: IWebIndexConfig | boolean;
  alias?: { [key: string]: string };

  // read only
  defaultCollectionName?: string;

  devServer?: undefined | IDevServerProps | boolean;
}
