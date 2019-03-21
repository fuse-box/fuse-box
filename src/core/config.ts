import * as appRoot from 'app-root-path';
import * as path from 'path';
import { ensureAbsolutePath } from '../utils/utils';
import { IConfig } from './interfaces';
const FUSE_MODULES = path.join(appRoot.path, 'modules');

export function createConfig(props: IConfig): IConfig {
  const config: IConfig = {
    root: process.env.APP_ROOT || appRoot.path,
  };

  config.defaultCollectionName = 'default';

  if (props.homeDir) {
    config.homeDir = ensureAbsolutePath(props.homeDir, config.root);
  }
  config.modules = [FUSE_MODULES];

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

  if (props.webIndex) {
    config.webIndex = props.webIndex;
  }

  config.options = {
    vendorSourceMap: false,
    projectSourceMap: true,
    cssSourceMap: true,
  };
  if (props.sourceMap !== undefined) {
    if (props.sourceMap === false) {
      config.options.projectSourceMap = false;
      config.options.cssSourceMap = false;
    }
    if (typeof props.sourceMap === 'object') {
      if (props.sourceMap.css === false) {
        config.options.cssSourceMap = false;
      }
      if (props.sourceMap.vendor === true) {
        config.options.vendorSourceMap = true;
      }
      if (props.sourceMap.project === false) {
        config.options.projectSourceMap = false;
      }
    }
  }

  config.plugins = props.plugins ? props.plugins : [];

  if (props.logging) {
    config.logging = props.logging;
  }

  if (props.entry) {
    config.options.entries = [].concat(props.entry);
  }

  return config;
}
