import { IDevServerProps } from '../dev-server/devServerProps';

import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { ILoggerProps } from '../logging/logging';
import { IWatcherExternalProps } from '../watcher/watcher';
import { IWebIndexConfig } from '../web-index/webIndex';
import { IStyleSheetProps } from './IStylesheetProps';
import { ensureAbsolutePath } from '../utils/utils';
import { Context } from '../core/Context';
import * as path from 'path';
import { IPublicConfig } from './IPublicConfig';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IProductionProps } from './IProductionProps';
import { IResourceConfig } from './IResourceConfig';
import { Cache } from '../cache/cache';
import { IWebWorkerConfig } from './IWebWorkerConfig';
import { ICodeSplittingConfig } from './ICodeSplittingConfig';

export interface IHMRExternalProps {
  reloadEntryOnStylesheet?: boolean;
}

const ESSENTIAL_DEPENDENCIES = ['fuse-box-dev-import', 'tslib'];

export type ITarget = 'browser' | 'server' | 'electron' | 'universal' | 'web-worker';

export interface IHMRProps {
  enabled?: boolean;
  hmrProps?: IHMRExternalProps;
}

export interface IWatcherProps {
  enabled: boolean;
  watcherProps?: IWatcherExternalProps;
}

export interface ICacheProps {
  enabled?: boolean;
  root?: string;
  FTL?: boolean;
}

export class PrivateConfig {
  root?: string;
  target?: ITarget;
  autoStartServerEntry?: boolean;
  dependencies?: {
    include?: Array<string>;
    ignore?: Array<string>;
    ignoreAllExternal?: boolean;
  };
  webWorkers?: IWebWorkerConfig;
  homeDir?: string;
  resources?: IResourceConfig;
  output?: string;
  modules?: Array<string>;
  logging?: ILoggerProps;
  watch?: IWatcherProps;
  hmr?: IHMRProps;
  stylesheet?: IStyleSheetProps;
  json?: IJSONPluginProps;
  env?: { [key: string]: string };
  cache?: ICacheProps;
  tsConfig?: string | IRawCompilerOptions;
  entries?: Array<string>;
  allowSyntheticDefaultImports?: boolean;
  webIndex?: IWebIndexConfig;
  sourceMap?: {
    sourceRoot?: string;
    vendor?: boolean;
    project?: boolean;
    css?: boolean;
  };

  plugins?: Array<(ctx: Context) => void>;
  alias?: { [key: string]: string };

  defaultCollectionName?: string;

  production?: IProductionProps;

  devServer?: IDevServerProps;

  codeSplitting?: ICodeSplittingConfig;

  // internal

  defaultSourceMapModulesRoot?: string;

  cacheObject?: Cache;

  public ctx?: Context;

  constructor(public props: IPublicConfig) {
    this.defaultSourceMapModulesRoot = '/modules';

    this.json = props.json === undefined ? { useDefault: false } : props.json;
    if (props.cacheObject) {
      this.cacheObject = props.cacheObject;
    }

    this.resources = props.resources || {};
    if (!this.resources.resourcePublicRoot) {
      this.resources.resourcePublicRoot = '/resources';
    }
  }

  public init(props: IPublicConfig) {
    this.dependencies = props.dependencies ? props.dependencies : {};
    if (this.isServer()) {
      if (props.autoStartServerEntry === undefined) {
        this.autoStartServerEntry = true;
      }
      if (this.dependencies.ignoreAllExternal === undefined) {
        this.dependencies.ignoreAllExternal = true;
      }
    }
    // define default settings for code splitting
    this.codeSplitting = props.codeSplitting || {};
    if (!this.codeSplitting.scriptRoot) {
      if (this.isServer()) {
        this.codeSplitting.scriptRoot = './';
      } else {
        if (this.webIndex && this.webIndex.publicPath) {
          this.codeSplitting.scriptRoot = this.webIndex.publicPath;
        } else {
          this.codeSplitting.scriptRoot = '/';
        }
      }
    }
  }

  public isEssentialDependency(name: string) {
    return ESSENTIAL_DEPENDENCIES.indexOf(name) > -1;
  }

  public supportsStylesheet() {
    return !this.isServer();
  }

  public setupEnv() {
    this.env =
      this.props.env === undefined ? { NODE_ENV: this.production ? 'production' : 'development' } : this.props.env;
  }

  public isServer() {
    return this.target === 'server' || this.target === 'universal';
  }

  public getResourceConfig(stylesheet?: IStyleSheetProps): IResourceConfig {
    let resources: IResourceConfig = {};
    if (stylesheet) {
      resources.resourceFolder = stylesheet.resourceFolder || this.resources.resourceFolder;
      resources.resourcePublicRoot = stylesheet.resourcePublicRoot || this.resources.resourcePublicRoot;
    } else {
      resources.resourceFolder = this.resources.resourceFolder;
      resources.resourcePublicRoot = this.resources.resourcePublicRoot;
    }
    if (!resources.resourcePublicRoot) resources.resourcePublicRoot = '/resources';

    if (resources.resourceFolder) {
      resources.resourceFolder = ensureAbsolutePath(resources.resourceFolder, this.ctx.writer.outputDirectory);
    } else {
      resources.resourceFolder = path.join(this.ctx.writer.outputDirectory, resources.resourcePublicRoot);
    }
    return resources;
  }
}
