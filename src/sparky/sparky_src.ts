import * as glob from 'glob';
import { isAbsolute } from 'path';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';

export async function sparky_src(rule: string) {
  return new Promise((resolve, reject) => {
    glob(rule, { cwd: env.SCRIPT_PATH }, function(err, files) {
      if (err) return reject(err);
      files = files.map(file => {
        if (!isAbsolute(file)) {
          return ensureAbsolutePath(file, env.SCRIPT_PATH);
        }
        return file;
      });
      return resolve(files);
    });
  });
}
