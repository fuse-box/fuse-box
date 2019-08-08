import * as appRoot from 'app-root-path';
import * as path from 'path';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';
import { IPublicConfig } from './IPublicConfig';
import { PrivateConfig } from './PrivateConfig';

export function createConfig(props: IPublicConfig): PrivateConfig {
  const config = new PrivateConfig(props);

  config.root = process.env.APP_ROOT || appRoot.path;
  config.defaultCollectionName = 'default';

  if (props.homeDir) {
    config.homeDir = ensureAbsolutePath(props.homeDir, env.SCRIPT_PATH);
  } else {
    config.homeDir = env.SCRIPT_PATH;
  }

  config.modules = [env.FUSE_MODULES];

  if (props.modules) {
    config.modules = config.modules.concat(props.modules).map(item => ensureAbsolutePath(item, env.SCRIPT_PATH));
  }
  if (props.output) {
    config.output = props.output;
  }
  if (props.alias) {
    config.alias = props.alias;
  }
  if (props.tsConfig) {
    if (typeof props.tsConfig === 'string') {
      config.tsConfig = ensureAbsolutePath(props.tsConfig, env.SCRIPT_PATH);
    } else {
      config.tsConfig = props.tsConfig;
    }
  }

  if (props.target) {
    config.target = props.target;
  }
  // allow them by default
  config.allowSyntheticDefaultImports = true;
  if (props.allowSyntheticDefaultImports !== undefined) {
    config.allowSyntheticDefaultImports = props.allowSyntheticDefaultImports;
  }
  config.webIndex = {
    enabled: false,
  };
  if (typeof props.webIndex === 'boolean') {
    config.webIndex.enabled = props.webIndex;
  } else if (typeof props.webIndex === 'object') {
    config.webIndex.enabled = typeof props.webIndex.enabled === 'boolean' ? props.webIndex.enabled : true;
    config.webIndex = props.webIndex;
  }

  config.sourceMap = {
    css: true,
    vendor: false,
    project: true,
    sourceRoot: '/',
  };

  if (props.sourceMap !== undefined) {
    if (props.sourceMap === false) {
      config.sourceMap.project = false;
      config.sourceMap.css = false;
    }

    if (typeof props.sourceMap === 'object') {
      if (props.sourceMap.sourceRoot) {
        config.sourceMap.sourceRoot = props.sourceMap.sourceRoot;
      }
      if (props.sourceMap.css === false) {
        config.sourceMap.css = false;
      }
      if (props.sourceMap.vendor === true) {
        config.sourceMap.vendor = true;
      }
      if (props.sourceMap.project === false) {
        config.sourceMap.project = false;
      }
    }
  }

  config.plugins = props.plugins ? props.plugins : [];

  if (props.logging) {
    config.logging = props.logging;
  }

  config.webWorkers = { enabled: true };
  if (props.webWorkers) {
    if (typeof props.webWorkers === 'boolean') config.webWorkers.enabled = props.webWorkers;
    if (typeof props.webWorkers === 'object') {
      config.webWorkers = props.webWorkers;
      config.webWorkers.enabled = props.webWorkers.enabled !== undefined ? props.webWorkers.enabled : true;
    }
  }
  // dev server *********************************************************************************************
  config.devServer = { enabled: false };
  if (typeof props.devServer === 'boolean') {
    config.devServer.enabled = props.devServer;
  } else if (typeof props.devServer === 'object') {
    config.devServer.enabled = typeof props.devServer.enabled === 'boolean' ? props.devServer.enabled : true;
    config.devServer = props.devServer;
  }

  // entry scripts ****************************************************************************************
  if (props.entry) {
    config.entries = [].concat(props.entry);
  }

  // cache ************************************************************************************************
  config.cache = {
    enabled: false,
    FTL: false,
    root: path.join(env.APP_ROOT, 'node_modules/.fusebox'),
  };

  if (typeof props.cache === 'boolean') {
    config.cache.enabled = props.cache;
  } else if (typeof props.cache === 'object') {
    config.cache.enabled = typeof props.cache.enabled === 'boolean' ? props.cache.enabled : env.isTest ? false : true;
    if (props.cache.root !== undefined) {
      config.cache.root = ensureAbsolutePath(props.cache.root, env.SCRIPT_PATH);
    }
    if (props.cache.FTL === true) {
      config.cache.FTL = true;
    }
  } else if (props.cache === undefined && !env.isTest) {
    config.cache.enabled = true;
  }

  config.stylesheet = {};

  if (props.stylesheet) {
    config.stylesheet = { ...config.stylesheet, ...props.stylesheet };
  }

  config.init(props);
  return config;
}
