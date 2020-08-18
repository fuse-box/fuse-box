import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';
import { readFile } from './utils/utils';

const VERSION = require('./../package.json').version;
const FUSE_ROOT = appRoot.path;
const WORKER_THREAD = path.resolve(appRoot.path, './dist/dev-threads/fuse_thread.js');
export const env = {
  APP_ROOT: appRoot.path,
  CACHE: {
    PACKAGES: 'packages',
    PROJET_FILES: 'project-files',
    ROOT: path.join(appRoot.path, 'node_modules/.fusebox', VERSION),
  },
  FUSE_MODULES: path.join(FUSE_ROOT, 'modules'),
  FUSE_ROOT: FUSE_ROOT,
  SCRIPT_FILE: require.main.filename,
  SCRIPT_PATH: path.dirname(require.main.filename),
  VERSION: VERSION,
  WORKER_THREAD,
  isTest: !!process.env.JEST_TEST,
};

export function getPackageManagerData() {
  if (fs.existsSync(path.join(FUSE_ROOT, './.yarnrc'))
      || fs.existsSync(path.join(FUSE_ROOT, './yarn.lock'))) {
    return {name: 'yarn', installCmd: 'yarn add', installDevCmd: 'yarn add --dev'}
  } else if (fs.existsSync(path.join(FUSE_ROOT, './pnpm-lock.yaml'))) {
    return {name: 'pnpm', installCmd: 'pnpm add', installDevCmd: 'pnpm add --save-dev'}
  } else {
    // package-lock.json
    return {name: 'npm', installCmd: 'npm install', installDevCmd: 'npm install --save-dev'}
  }
}

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
