import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';
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

export function getPackageManagerData() {
  console.log("SHIT");
  console.log(FUSE_ROOT);
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
