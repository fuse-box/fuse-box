import * as appRoot from 'app-root-path';
import { ensureAbsolutePath } from '../utils/utils';
import { env } from '../core/env';

import * as path from 'path';
import { IPublicConfig } from './IPublicConfig';
import { IPrivateConfig } from './IPrivateConfig';
export function createConfig(props: IPublicConfig): IPrivateConfig {
  const config: IPrivateConfig = {
    root: process.env.APP_ROOT || appRoot.path,
  };

  config.defaultCollectionName = 'default';

  if (props.homeDir) {
    config.homeDir = ensureAbsolutePath(props.homeDir, config.root);
  } else {
    config.homeDir = env.APP_ROOT;
  }

  config.modules = [env.FUSE_MODULES];

  if (props.modules) {
    config.modules = config.modules.concat(props.modules);
  }
  if (props.output) {
    config.output = props.output;
  }
  if (props.alias) {
    config.alias = props.alias;
  }

  if (props.target) {
    config.target = props.target;
  }
  if (props.production) {
    config.production = props.production;
  }

  if (props.allowSyntheticDefaultImports) {
    config.allowSyntheticDefaultImports = true;
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
    sourceRoot: '/src',
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
    root: path.join(env.APP_ROOT, 'node_modules/.fusebox', env.VERSION),
  };

  if (typeof props.cache === 'boolean') {
    config.cache.enabled = props.cache;
  } else if (typeof props.cache === 'object') {
    config.cache.enabled = typeof props.cache.enabled === 'boolean' ? props.cache.enabled : true;
    if (props.cache.root !== undefined) {
      config.cache.root = path.join(props.cache.root, env.VERSION);
    }
  }

  // hmr ************************************************************************************************
  config.hmr = {
    enabled: false,
  };

  config.watch = {
    enabled: false,
  };

  if (props.watch !== undefined) {
    if (typeof props.watch === 'boolean') {
      config.watch.enabled = props.watch;
    }
    if (typeof props.watch === 'object') {
      config.watch.enabled = typeof props.watch === 'boolean' ? props.watch : true;
      config.watch.watcherProps = props.watch;
    }
    if (config.watch.enabled && config.hmr.enabled !== false) {
      config.hmr.enabled = true;
    }
  }

  if (props.hmr) {
    if (typeof props.hmr === 'boolean') {
      config.hmr.enabled = props.hmr;
    }
  }

  config.stylesheet = {};

  if (props.stylesheet) {
    config.stylesheet = { ...config.stylesheet, ...props.stylesheet };
  }

  return config;
}