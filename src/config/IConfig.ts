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
import { IElectronOptions } from './IElectronOptions';
import { IThreadingConfig } from './IThreadingConfig';
import { IWatcherPublicConfig } from './IWatcher';
import { IWebWorkerConfig } from './IWebWorkerConfig';
import { INodeModuleLookup } from '../resolver/nodeModuleLookup';


interface ISourceMap {
  css?: boolean;
  project?: boolean;
  sourceRoot?: string;
  vendor?: boolean;
}

export interface IPublicConfig {
  alias?: { [key: string]: string };
  cache?: ICacheProps | boolean;
  compilerOptions?: ICompilerOptions;
  dependencies?: IDependencies;
  devServer?: undefined | IDevServerProps | boolean;
  electron?: IElectronOptions;
  entry?: Array<string> | string;
  env?: { [key: string]: string };
  hmr?: IHMRProps | boolean;
  json?: IJSONPluginProps;
  link?: IPluginLinkOptions;
  logging?: IFuseLoggerProps;
  modules?: Array<string>;
  plugins?: Array<(ctx: Context) => void>;
  resources?: IResourceConfig;
  sourceMap?: boolean | ISourceMap;
  stylesheet?: IStyleSheetProps;
  target?: ITarget;
  threading?: IThreadingConfig;
  watcher?: IWatcherPublicConfig | boolean;
  webIndex?: IWebIndexConfig | boolean;
  webWorkers?: IWebWorkerConfig;
}

export interface IConfig {
  cache?: ICacheProps;
  cleanCSS?: any;
  compilerOptions?: ICompilerOptions;
  dependencies?: IDependencies;
  devServer?: IDevServerProps;
  electron?: IElectronOptions;
  entries?: Array<string>;
  hmr?: IHMRProps;
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
  threading?: IThreadingConfig;
  tsHelpersPath?: string;
  uglify?: boolean;
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
  shouldIgnoreDependency?: (pkg: INodeModuleLookup) => boolean;
  supportsStylesheet?: () => boolean;
}
