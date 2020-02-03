import { existsSync } from 'fs';
import * as path from 'path';
import { Context } from '../core/context';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';
import { EnvironmentType } from './EnvironmentType';
import { IConfig, IPublicConfig } from './IConfig';
import { IResourceConfig } from './IResourceConfig';
import { IRunProps } from './IRunProps';
import { IStyleSheetProps } from './IStylesheetProps';

const ESSENTIAL_DEPENDENCIES = ['fuse_helpers_decorate'];

export function Configuration(ctx: Context): IConfig {
  const self: IConfig = {
    getPublicRoot: (existing?: string) => {
      if (existing) return existing;
      let publicPath = '/';
      if (self.webIndex && self.webIndex.publicPath) publicPath = self.webIndex.publicPath;
      if (self.resources && self.resources.resourcePublicRoot) return publicPath;
    },
    getResourceConfig: (stylesheet?: IStyleSheetProps) => {
      let resources: IResourceConfig = {};
      if (stylesheet) {
        resources.resourceFolder = stylesheet.resourceFolder || self.resources.resourceFolder;
        resources.resourcePublicRoot = stylesheet.resourcePublicRoot || self.resources.resourcePublicRoot;
      } else {
        resources.resourceFolder = self.resources.resourceFolder;
        resources.resourcePublicRoot = self.resources.resourcePublicRoot;
      }
      if (!resources.resourcePublicRoot) resources.resourcePublicRoot = '/resources';

      resources.resourceFolder = resources.resourceFolder
        ? ensureAbsolutePath(resources.resourceFolder, ctx.writer.outputDirectory)
        : path.join(ctx.writer.outputDirectory, resources.resourcePublicRoot);

      return resources;
    },
    isEssentialDependency: (name: string) => ESSENTIAL_DEPENDENCIES.includes(name),
    shouldIgnoreDependency: (name: string) => {
      if (self.dependencies.ignoreAllExternal && !self.isEssentialDependency(name)) return true;
      if (self.dependencies.ignorePackages && self.dependencies.ignorePackages.includes(name)) return true;
      return false;
    },
    supportsStylesheet: () => self.target === 'browser' || self.target === 'electron',
  };

  return self;
}

export function createConfig(props: {
  ctx: Context;
  envType?: EnvironmentType;
  publicConfig: IPublicConfig;
  runProps: IRunProps;
}): IConfig {
  let { publicConfig, runProps } = props;
  runProps = runProps || {};
  const config = Configuration(props.ctx);
  if (runProps.buildTarget) {
    config.productionBuildTarget = runProps.buildTarget;
    config.tsHelpersPath = runProps.tsHelpersPath;
    if (!config.tsHelpersPath) config.tsHelpersPath = path.join(env.FUSE_MODULES, 'ts_config_helpers/tslib.js');
  }

  if (publicConfig.homeDir) config.homeDir = publicConfig.homeDir || env.APP_ROOT;

  config.isDevelopment = props.envType === EnvironmentType.DEVELOPMENT;
  config.isProduction = props.envType === EnvironmentType.PRODUCTION;
  config.isTest = props.envType === EnvironmentType.TEST;

  config.modules = [env.FUSE_MODULES];

  if (publicConfig.modules) {
    config.modules = config.modules.concat(publicConfig.modules).map(item => ensureAbsolutePath(item, env.SCRIPT_PATH));
  }

  if (publicConfig.alias) {
    config.alias = publicConfig.alias;
  }

  if (publicConfig.target) {
    config.target = publicConfig.target;
  }
  config.webIndex = {
    enabled: false,
  };
  if (typeof publicConfig.webIndex === 'boolean') {
    config.webIndex.enabled = publicConfig.webIndex;
  } else if (typeof publicConfig.webIndex === 'object') {
    config.webIndex = publicConfig.webIndex;
    config.webIndex.enabled = typeof publicConfig.webIndex.enabled === 'boolean' ? publicConfig.webIndex.enabled : true;
  }

  config.sourceMap = {
    css: true,
    project: true,
    sourceRoot: '/',
    vendor: false,
  };

  if (publicConfig.sourceMap !== undefined) {
    if (publicConfig.sourceMap === false) {
      config.sourceMap.project = false;
      config.sourceMap.css = false;
    }

    if (typeof publicConfig.sourceMap === 'object') {
      if (publicConfig.sourceMap.sourceRoot) {
        config.sourceMap.sourceRoot = publicConfig.sourceMap.sourceRoot;
      }
      if (publicConfig.sourceMap.css === false) {
        config.sourceMap.css = false;
      }
      if (publicConfig.sourceMap.vendor === true) {
        config.sourceMap.vendor = true;
      }
      if (publicConfig.sourceMap.project === false) {
        config.sourceMap.project = false;
      }
    }
  }

  config.watcher = {};
  if (publicConfig.watcher !== undefined) {
    if (typeof publicConfig.watcher === 'boolean') config.watcher.enabled = publicConfig.watcher;
    else if (typeof publicConfig.watcher === 'object') config.watcher = publicConfig.watcher;
  }
  if (config.watcher.enabled === undefined) {
    if (config.isDevelopment) config.watcher.enabled = true;
  }
  config.plugins = publicConfig.plugins ? publicConfig.plugins : [];

  if (publicConfig.logging) {
    config.logging = publicConfig.logging;
  } else {
    config.logging = { level: 'succinct' };
  }
  if (process.argv.includes('--verbose')) config.logging.level = 'verbose';

  if (publicConfig.compilerOptions) {
    config.compilerOptions = publicConfig.compilerOptions;
  }

  config.webWorkers = { enabled: true };
  if (publicConfig.webWorkers) {
    if (typeof publicConfig.webWorkers === 'boolean') config.webWorkers.enabled = publicConfig.webWorkers;
    if (typeof publicConfig.webWorkers === 'object') {
      config.webWorkers = publicConfig.webWorkers;
      config.webWorkers.enabled =
        publicConfig.webWorkers.enabled !== undefined ? publicConfig.webWorkers.enabled : true;
    }
  }
  // dev server *********************************************************************************************
  config.devServer = { enabled: false };
  if (typeof publicConfig.devServer === 'boolean') {
    config.devServer.enabled = publicConfig.devServer;
  } else if (typeof publicConfig.devServer === 'object') {
    config.devServer.enabled =
      typeof publicConfig.devServer.enabled === 'boolean' ? publicConfig.devServer.enabled : true;
    config.devServer = publicConfig.devServer;
  }

  // entry scripts ****************************************************************************************
  if (publicConfig.entry) {
    config.entries = [].concat(publicConfig.entry).map(entry => {
      const entryPath = ensureAbsolutePath(entry, env.SCRIPT_PATH);
      if (!existsSync(entryPath)) {
        throw new Error(`Failed to resolve entry point ${entryPath}`);
      }
      return entryPath;
    });
  }

  // cache ************************************************************************************************
  config.cache = {
    enabled: false,
    root: path.join(env.APP_ROOT, '.cache'),
  };

  if (typeof publicConfig.cache === 'boolean') {
    config.cache.enabled = publicConfig.cache;
  } else if (typeof publicConfig.cache === 'object') {
    config.cache.enabled =
      typeof publicConfig.cache.enabled === 'boolean' ? publicConfig.cache.enabled : env.isTest ? false : true;
    if (publicConfig.cache.root !== undefined) {
      config.cache.root = ensureAbsolutePath(publicConfig.cache.root, env.SCRIPT_PATH);
    }
    if (publicConfig.cache.strategy !== undefined) {
      config.cache.strategy = publicConfig.cache.strategy;
    }
  } else if (publicConfig.cache === undefined && !env.isTest) {
    config.cache.enabled = true;
  }
  if (!config.cache.strategy) config.cache.strategy = 'fs';

  config.stylesheet = {};

  if (publicConfig.stylesheet) {
    config.stylesheet = { ...config.stylesheet, ...publicConfig.stylesheet };
  }

  config.dependencies = publicConfig.dependencies === undefined ? {} : publicConfig.dependencies;

  /**  DEFAULT DEPENDENCY SETUP  */
  if (config.target === 'server') {
    if (config.dependencies.ignoreAllExternal === undefined) {
    }
    config.dependencies.ignoreAllExternal = true;
  }

  /*  DEFAULT WATCHER AND HTML */
  config.watcher = {
    enabled: config.isDevelopment,
  };

  if (publicConfig.watcher !== undefined) {
    if (typeof publicConfig.watcher === 'boolean') {
      config.watcher.enabled = publicConfig.watcher;
    }
    if (typeof publicConfig.watcher === 'object') {
      config.watcher = publicConfig.watcher;
      if (typeof config.watcher.enabled === undefined) config.watcher.enabled = true;
    }
  }

  // hmr ************************************************************************************************
  const hmrAllowedByDefault = config.isDevelopment && config.target !== 'server' && config.watcher.enabled;
  config.hmr = {
    enabled: hmrAllowedByDefault,
  };

  if (hmrAllowedByDefault && publicConfig.hmr !== undefined) {
    if (typeof publicConfig.hmr === 'boolean') {
      config.hmr.enabled = publicConfig.hmr;
    }
  }

  /**  DEFAULT PLUGIN SETUP */

  config.link = publicConfig.link ? publicConfig.link : {};
  config.json = publicConfig.json === undefined ? { useDefault: false } : publicConfig.json;

  /* resources */
  config.resources = publicConfig.resources || {};
  if (!config.resources.resourcePublicRoot) {
    config.resources.resourcePublicRoot = '/resources';
  }

  config.env = publicConfig.env ? publicConfig.env : {};

  if (!config.env.NODE_ENV) {
    if (config.isDevelopment) config.env.NODE_ENV = 'development';
    if (config.isProduction) config.env.NODE_ENV = 'production';
  }

  return config;
}
