import { sparkyChain } from './sparky_chain';
import { getLogger } from '../logging/logging';
import { removeFolder, ensureAbsolutePath } from '../utils/utils';
import { env } from '../env';

export function sparky<T>(Ctx: new () => T) {
  const ctx = new Ctx();
  const tasks: any = {};

  const log = getLogger({ level: 'verbose' });

  let execScheduled = false;
  const execNext = () => {
    if (!execScheduled) {
      const argv = process.argv;
      argv.splice(0, 2);
      let taskName = argv[0] || 'default';

      taskName = /^--/.test(taskName) ? 'default' : taskName;

      setTimeout(async () => {
        await scope.exec(taskName);
        log.printErrors();
        log.printWarnings();
      }, 0);
    }
    execScheduled = true;
  };

  const scope = {
    activities: [],
    rm: (folder: string) => {
      removeFolder(ensureAbsolutePath(folder, env.SCRIPT_PATH));
    },
    src: (glob: string) => sparkyChain(log).src(glob),
    exec: async (name: string) => {
      if (!tasks[name]) {
        log.error("Can't find task name: $name", { name });
        return;
      }

      log.print('<cyan>→ Running <bold>$name</bold></cyan>', { name });

      await tasks[name](ctx);
    },
    task: (name: string, fn: (ctx: T) => void) => {
      tasks[name] = fn;
      execNext();
    },
  };
  return scope;
}
