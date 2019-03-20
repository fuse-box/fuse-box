import * as path from 'path';
import * as appRoot from 'app-root-path';
import { readFile } from '../utils/utils';

export const env = {
  APP_ROOT: appRoot.path,
  FUSE_MODULES: path.join(appRoot.path, 'modules'),
};

export function getDevelopmentApi() {
  const contents = readFile(path.join(env.FUSE_MODULES, 'fuse-loader/index.js'));
  return `(function(){
    ${contents}
})();`;
}
