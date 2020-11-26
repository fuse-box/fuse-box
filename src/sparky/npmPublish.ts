import { spawn } from 'child_process';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';

export async function npmPublish(opts: { path: string; tag?: string }): Promise<void> {
  opts.tag = opts.tag || 'latest';

  return new Promise((resolve, reject) => {
    const publish = spawn('npm', ['publish', '--tag', opts.tag], {
      cwd: ensureAbsolutePath(opts.path, env.SCRIPT_PATH),
      stdio: 'inherit',
    });
    publish.on('close', function(code) {
      if (code === 8) {
        return reject('Error detected, waiting for changes...');
      }
      return resolve();
    });
  });
}
