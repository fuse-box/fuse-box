import { env } from '../env';
import { createFuseLogger } from '../fuseLog/FuseBoxLogAdapter';
import { ensureAbsolutePath, removeFolder } from '../utils/utils';
import { sparkyChain } from './sparky_chain';

let prettyTime = require('pretty-time');

export function sparky<T>(Ctx: new () => T) {
  const ctx = new Ctx();
  const tasks: Map<string | RegExp, Function> = new Map();

  const log = createFuseLogger({ level: 'verbose' });
  log.flush();

  const findTask = (name: string): Function => {
    for (const [key, value] of tasks.entries()) {
      if (typeof key === 'string' && key === name) return value;
      if (key instanceof RegExp && (key as RegExp).test(name)) return value;
    }

    return null;
  };

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
    exec: async (name: string) => {
      const task = findTask(name);

      if (!task) {
        log.error("Can't find task name: $name", { name });
        log.printBottomMessages();
        return;
      }

      times[name] = process.hrtime();

      log.info('<magenta>[ ' + name + ' ]</magenta>', 'Starting', { name });
      await task(ctx);

      log.info('<dim><magenta>[ ' + name + ' ]</magenta></dim>', '<dim>Completed in $time</dim>', {
        time: prettyTime(process.hrtime(times[name]), 'ms'),
      });

      log.printBottomMessages();
    },
    rm: (folder: string) => {
      removeFolder(ensureAbsolutePath(folder, env.SCRIPT_PATH));
    },
    src: (glob: string) => sparkyChain(log).src(glob),
    task: (name: string | RegExp, fn: (ctx: T) => void) => {
      tasks.set(name, fn);
      execNext();
    },
  };

  return scope;
}
