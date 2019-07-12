import * as appRoot from 'app-root-path';
import * as path from 'path';
import { readFile } from './utils/utils';

const VERSION = require('./../package.json').version;
const FUSE_ROOT = appRoot.path;
export const env = {
  FUSE_ROOT: FUSE_ROOT,
  APP_ROOT: appRoot.path,
  VERSION: VERSION,
  isTest: !!process.env.JEST_TEST,
  CACHE: {
    ROOT: path.join(appRoot.path, 'node_modules/.fusebox', VERSION),
    PACKAGES: 'packages',
    PROJET_FILES: 'project-files',
  },
  SCRIPT_PATH: path.dirname(require.main.filename),
  SCRIPT_FILE: require.main.filename,
  FUSE_MODULES: path.join(FUSE_ROOT, 'modules'),
};

export function getDevelopmentApi() {
  const contents = readFile(path.join(env.FUSE_MODULES, 'fuse-loader/index.js'));
  return `(function(){
    ${contents}
})();`;
}

export function openDevelopmentApi() {
  const contents = readFile(path.join(env.FUSE_MODULES, 'fuse-loader/index.js'));
  return `(function(){
    var FuseBox = (function(){
      ${contents}
      return FuseBox;
    })()
`;
}

export function closeDevelopmentApi() {
  return `\n})();`;
}
