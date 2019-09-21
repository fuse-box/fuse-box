import * as path from 'path';
import { Cache } from '../cache/cache';
import { Context } from '../core/Context';
import { IDevServerProps } from '../dev-server/devServerProps';
import { env } from '../env';
import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { IJSONPluginProps } from '../plugins/core/plugin_json';
import { IPluginLinkOptions } from '../plugins/core/plugin_link';
import { ensureAbsolutePath, joinFuseBoxPath } from '../utils/utils';
import { IWatcherExternalProps } from '../watcher/watcher';
import { IWebIndexConfig } from '../web-index/webIndex';
import { ICodeSplittingConfig } from './ICodeSplittingConfig';
import { IFuseLoggerProps } from './IFuseLoggerProps';
import { IManifest } from './IManifest';
import { IProductionProps } from './IProductionProps';
import { IPublicConfig } from './IPublicConfig';
import { IResourceConfig } from './IResourceConfig';
import { IStyleSheetProps } from './IStylesheetProps';
import { IWebWorkerConfig } from './IWebWorkerConfig';

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
  dependencies?: {
    include?: Array<string>;
    ignorePackages?: Array<string>;
    ignoreAllExternal?: boolean;
  };
  useSingleBundle?: boolean;
  webWorkers?: IWebWorkerConfig;
  homeDir?: string;
  resources?: IResourceConfig;
  output?: string;
  modules?: Array<string>;
  logging?: IFuseLoggerProps;
  watch?: IWatcherProps;
  hmr?: IHMRProps;
  stylesheet?: IStyleSheetProps;
  json?: IJSONPluginProps;
  link?: IPluginLinkOptions;
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
  manifest?: IManifest;

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
      if (this.dependencies.ignoreAllExternal === undefined) {
        this.dependencies.ignoreAllExternal = true;
      }
    }
    // define default settings for code splitting
    this.codeSplitting = props.codeSplitting || {};
    this.codeSplitting.useHash = typeof this.codeSplitting.useHash === undefined ? true : this.codeSplitting.useHash;
    this.codeSplitting.maxPathLength = typeof this.codeSplitting.maxPathLength === 'number' ? this.codeSplitting.maxPathLength : 20;

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


    this.watch = {
      enabled: !env.isTest,
    };

    if (props.watch !== undefined) {
      if (typeof props.watch === 'boolean') {
        this.watch.enabled = props.watch;
      }
      if (typeof props.watch === 'object') {
        this.watch.enabled = typeof props.watch === 'boolean' ? props.watch : true;
        this.watch.watcherProps = props.watch;
      }
    }

    // hmr ************************************************************************************************
    const hmrAllowedByDefault = !env.isTest && this.target !== 'server' && this.watch.enabled;
    this.hmr = {
      enabled: hmrAllowedByDefault,
      hmrProps: {
        reloadEntryOnStylesheet: true,
      },
    };

    if (hmrAllowedByDefault && props.hmr !== undefined) {
      if (typeof props.hmr === 'boolean') {
        this.hmr.enabled = props.hmr;
      }
      if (typeof props.hmr === 'object') {
        this.hmr.enabled = true;
        this.hmr.hmrProps = { ...this.hmr.hmrProps, ...props.hmr };
      }
    }
    // Plugin Link
    this.link = props.link ? props.link : {};

    if (props.useSingleBundle !== undefined) this.useSingleBundle = props.useSingleBundle;
  }

  public isEssentialDependency(name: string) {
    return ESSENTIAL_DEPENDENCIES.indexOf(name) > -1;
  }

  public shoudIgnorePackage(name: string): boolean {
    if (this.dependencies.ignoreAllExternal && !this.isEssentialDependency(name)) {
      return true;
    }
    if (this.dependencies.ignorePackages && this.dependencies.ignorePackages.indexOf(name) > -1) {
      return true;
    }
    return false;
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

  public getPublicRoot(userPublicPath?: string) {
    if (userPublicPath) {
      return userPublicPath;
    }
    let publicPath = '/';
    if (this.webIndex && this.webIndex.publicPath) {
      publicPath = this.webIndex.publicPath;
    }
    if (this.resources && this.resources.resourcePublicRoot) {
      publicPath = joinFuseBoxPath(publicPath, this.resources.resourcePublicRoot);
    }
    return publicPath;
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
