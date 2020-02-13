import { ChildProcess, fork } from 'child_process';

import { BundleType, IBundleWriteResponse } from '../bundle/bundle';
import { Context } from '../core/context';

export interface IServerProcess {
  start: (cliArgs: Array<string>) => ChildProcess;
  stop: () => void;
}

export const createServerProcess = (ctx: Context, bundles: Array<IBundleWriteResponse>): IServerProcess => {
  let server: ChildProcess;
  let entry: string;
  if (bundles.length === 1) {
    entry = bundles[0].absPath;
  } else {
    let resolved = false;
    for (const bundle of bundles) {
      if (bundle.bundle.type === BundleType.JS_SERVER_ENTRY) {
        resolved = true;
        entry = bundle.absPath;
        break;
      }
    }
    if (!resolved) {
      throw new Error('No serverEntry file found!!');
    }
  }

  return {
    start: (cliArgs: Array<string> = []): ChildProcess => {
      server = fork(entry, cliArgs, {
        env: {
          ...process.env,
          ...ctx.config.env,
        },
        stdio: 'inherit',
      });
      server.on('close', code => {
        if (code === 8) {
          console.error('Error detected, waiting for changes...');
        }
      });
      return server;
    },
    stop: () => {
      server.kill();
    },
  };
};
