import * as appRoot from 'app-root-path';
import { ensureAbsolutePath } from '../utils/utils';
import { IConfig } from './interfaces';
import * as path from 'path';
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

  if (props.target) {
    config.target = props.target;
  }

  if (props.fuseBoxPolyfillsFolder) {
    config.fuseBoxPolyfillsFolder = props.fuseBoxPolyfillsFolder;
  }
  return config;
}
