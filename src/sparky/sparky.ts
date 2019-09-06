import { env } from '../env';
import { createFuseLogger } from '../fuse-log/FuseBoxLogAdapter';
import { ensureAbsolutePath, removeFolder } from '../utils/utils';
import { sparkyChain } from './sparky_chain';

import * as prettyTime from 'pretty-time';

export function sparky<T>(Ctx: new () => T) {
  const ctx = new Ctx();
  const tasks: any = {};

  const log = createFuseLogger({ level: 'verbose' });
  log.flush();
  let execScheduled = false;
  const execNext = () => {
    if (!execScheduled) {
      const argv = process.argv;
      argv.splice(0, 2);
      let taskName = argv[0] || 'default';

      taskName = /^--/.test(taskName) ? 'default' : taskName;

      setTimeout(async () => {
        await scope.exec(taskName);
      }, 0);
    }
    execScheduled = true;
  };

  const times: any = {};
  const scope = {
    activities: [],
    rm: (folder: string) => {
      removeFolder(ensureAbsolutePath(folder, env.SCRIPT_PATH));
    },
    src: (glob: string) => sparkyChain(log).src(glob),
    exec: async (name: string) => {
      if (!tasks[name]) {
        log.error("Can't find task name: $name", { name });
        log.printBottomMessages();
        return;
      }
      times[name] = process.hrtime();

      log.info('<magenta>[ ' + name + ' ]</magenta>', 'Starting', { name });
      await tasks[name](ctx);
      log.info('<dim><magenta>[ ' + name + ' ]</magenta></dim>', '<dim>Completed in $time</dim>', {
        time: prettyTime(process.hrtime(times[name]), 'ms'),
      });

      log.printBottomMessages();
    },
    task: (name: string, fn: (ctx: T) => void) => {
      tasks[name] = fn;
      execNext();
    },
  };
  return scope;
}
