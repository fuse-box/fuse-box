import { spawn } from 'child_process';
import { ensureAbsolutePath } from '../utils/utils';
import { env } from '../env';

export async function npmPublish(opts: { path: string; tag?: string }) {
  opts.tag = opts.tag || 'latest';

  return new Promise((resolve, reject) => {
    const publish = spawn('npm', ['publish', '--tag', opts.tag], {
      stdio: 'inherit',
      cwd: ensureAbsolutePath(opts.path, env.SCRIPT_PATH),
    });
    publish.on('close', function(code) {
      if (code === 8) {
        return reject('Error detected, waiting for changes...');
      }
      return resolve();
    });
  });
}
