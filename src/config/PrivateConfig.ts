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

export interface IHMRExternalProps {
  reloadEntryOnStylesheet?: boolean;
}

export interface IHMRProps {
  enabled?: boolean;
  hmrProps?: IHMRExternalProps;
}

export interface IWatcherProps {
  enabled: boolean;
  watcherProps?: IWatcherExternalProps;
}

export interface ICacheProps {
  enabled: boolean;
  root?: string;
}

export class PrivateConfig {
  root?: string;
  target?: 'browser' | 'server' | 'electron' | 'universal';
  autoStartServerEntry?: boolean;
  dependencies?: {
    include?: Array<string>;
    ignore?: Array<string>;
    ignoreAllExternal?: boolean;
  };
  homeDir?: string;
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

  production?: {};

  devServer?: IDevServerProps;

  // internal

  defaultResourcePublicRoot: string;
  defaultSourceMapModulesRoot: string;

  private _resourceFolder: string;

  constructor(props: IPublicConfig) {
    this.defaultResourcePublicRoot = '/resources';
    this.defaultSourceMapModulesRoot = '/modules';

    this.env = props.env === undefined ? { NODE_ENV: this.production ? 'production' : 'development' } : props.env;

    this.json = props.json === undefined ? { useDefault: false } : props.json;
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
  }

  public getResourcePublicRoot() {
    return this.stylesheet.resourcePublicRoot || this.defaultResourcePublicRoot;
  }

  public isServer() {
    return this.target === 'server' || this.target === 'universal';
  }

  public getResourceFolder(ctx: Context) {
    if (this._resourceFolder) {
      return this._resourceFolder;
    }
    if (this.stylesheet.resourceFolder) {
      this._resourceFolder = ensureAbsolutePath(this.stylesheet.resourceFolder, ctx.writer.outputDirectory);
    } else {
      this._resourceFolder = path.join(ctx.writer.outputDirectory, this.defaultResourcePublicRoot);
    }
    return this._resourceFolder;
  }
}
