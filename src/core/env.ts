import * as path from 'path';
import * as appRoot from 'app-root-path';
import { readFile } from '../utils/utils';

const VERSION = '4.0.0';
export const env = {
  APP_ROOT: appRoot.path,
  VERSION: VERSION,
  CACHE: {
    ROOT: path.join(appRoot.path, 'node_modules/.fusebox', VERSION),
    PACKAGES: 'packages',
    PROJET_FILES: 'project-files',
  },
  SCRIPT_PATH: path.dirname(require.main.filename),
  SCRIPT_FILE: require.main.filename,
  FUSE_MODULES: path.join(appRoot.path, 'modules'),
};

export function getDevelopmentApi() {
  const contents = readFile(path.join(env.FUSE_MODULES, 'fuse-loader/index.js'));
  return `(function(){
    ${contents}
})();`;
}
