import { ChildProcess, spawn } from 'child_process';
import { BundleType, IBundleWriteResponse } from '../bundle/bundle';
import { Context } from '../core/context';
import { onExit } from '../utils/exit';

export interface IServerProcess {
  start: (cliArgs?: Array<string>) => ChildProcess;
  stop: () => void;
}

function getAbsPath(ctx: Context, bundles: Array<IBundleWriteResponse>) {
  let entry: string;
  let resolved = false;
  for (const bundle of bundles) {
    if (bundle.bundle.type === BundleType.JS_SERVER_ENTRY) {
      resolved = true;
      entry = bundle.absPath;
      break;
    } else {
      if (bundle.bundle.type === BundleType.JS_APP) {
        resolved = true;
        entry = bundle.absPath;
      }
    }
  }

  if (!resolved) {
    ctx.fatal('server', ['Failed to resolve server entry']);
  }

  return entry;
}

export const createServerProcess = (props: {
  bundles: Array<IBundleWriteResponse>;
  ctx: Context;
  processName: string;
}): IServerProcess => {
  const { bundles, ctx, processName } = props;
  let server: ChildProcess;
  if (ctx.serverProcess) return ctx.serverProcess;

  let entry = getAbsPath(ctx, bundles);

  //const electronPath = require('electron');

  const self = {
    start: (cliArgs?: Array<string>): ChildProcess => {
      cliArgs = cliArgs || [];
      ctx.log.info('server', `spawn ${entry}`);
      server = spawn(processName, [entry, ...cliArgs], {
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
      if (server) {
        server.kill();
        ctx.log.info('server', `Killed ${entry}`);
      }
    },
  };
  onExit('ServerProcess', () => {
    self.stop();
  });

  ctx.ict.on('rebundle', props => {
    entry = getAbsPath(ctx, props.bundles);
    self.stop();
    self.start();
  });

  ctx.serverProcess = self;

  return self;
};
