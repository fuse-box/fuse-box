import { ICompilerOptions } from '../compilerOptions/interfaces';
import { Context } from '../core/context';
import { IDevServerProps } from '../devServer/devServerProps';
import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IPluginLinkOptions } from '../plugins/core/plugin_link';
import { IWebIndexConfig } from '../webIndex/webIndex';
import { ICacheProps } from './ICacheProps';
import { IFuseLoggerProps } from './IFuseLoggerProps';
import { IHMRProps } from './IHMRProps';
import { IResourceConfig } from './IResourceConfig';
import { IRunProps } from './IRunProps';
import { IStyleSheetProps } from './IStylesheetProps';
import { ITarget } from './ITarget';

import { IDependencies } from './IDependencies';
import { IWatcherPublicConfig } from './IWatcher';
import { IWebWorkerConfig } from './IWebWorkerConfig';

export interface IPublicConfig {
  compilerOptions?: ICompilerOptions;
  homeDir?: string;

  logging?: IFuseLoggerProps;
  modules?: Array<string>;

  cache?: ICacheProps | boolean;
  dependencies?: IDependencies;
  entry?: Array<string> | string;
  hmr?: IHMRProps | boolean;
  json?: IJSONPluginProps;
  link?: IPluginLinkOptions;
  plugins?: Array<(ctx: Context) => void>;
  resources?: IResourceConfig;
  sourceMap?:
    | boolean
    | {
        css?: boolean;
        project?: boolean;
        sourceRoot?: string;
        vendor?: boolean;
      };
  stylesheet?: IStyleSheetProps;
  target?: ITarget;
  watcher?: IWatcherPublicConfig | boolean;
  webWorkers?: IWebWorkerConfig;
  env?: { [key: string]: string };

  webIndex?: IWebIndexConfig | boolean;
  alias?: { [key: string]: string };

  devServer?: undefined | IDevServerProps | boolean;
}

export interface IConfig {
  cache?: ICacheProps;
  compilerOptions?: ICompilerOptions;
  dependencies?: IDependencies;
  devServer?: IDevServerProps;
  entries?: Array<string>;
  hmr?: IHMRProps;
  homeDir?: string;
  isDevelopment?: boolean;
  isProduction?: boolean;
  isTest?: boolean;
  json?: IJSONPluginProps;
  link?: IPluginLinkOptions;
  logging?: IFuseLoggerProps;
  modules?: Array<string>;
  output?: IRunProps;
  plugins?: Array<(ctx: Context) => void>;
  productionBuildTarget?: ITypescriptTarget;
  resources?: IResourceConfig;
  stylesheet?: IStyleSheetProps;
  target?: ITarget;
  tsHelpersPath?: string;
  watcher?: IWatcherPublicConfig;
  webIndex?: IWebIndexConfig;
  webWorkers?: IWebWorkerConfig;
  alias?: { [key: string]: string };
  env?: { [key: string]: string };
  sourceMap?: {
    css?: boolean;
    project?: boolean;
    sourceRoot?: string;
    vendor?: boolean;
  };

  getPublicRoot?: (target?: string) => string;
  getResourceConfig: (stylesheet?: IStyleSheetProps) => IResourceConfig;
  isEssentialDependency?: (name: string) => boolean;
  shouldIgnoreDependency?: (name: string) => boolean;
  supportsStylesheet?: () => boolean;
}
