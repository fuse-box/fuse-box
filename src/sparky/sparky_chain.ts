import { simplifiedRegExp } from '../plugins/pluginUtils';
import {
  readFile,
  writeFile,
  ensureFuseBoxPath,
  ensureAbsolutePath,
  copyFile,
  ensureDir,
  removeFile,
} from '../utils/utils';
import { sparky_src } from './sparky_src';
import { tsc, TscOptions } from './tsc';
import { ILogger } from '../logging/logging';
import { env } from '../env';
import * as path from 'path';
import { IBumpVersion, bumpVersion } from './bumpVersion';
export interface ISparkyChain {
  src: (glob: string) => ISparkyChain;
  tsc: (opts: TscOptions) => ISparkyChain;
  clean: () => ISparkyChain;
  filter: (a: RegExp | ((file: string) => any)) => ISparkyChain;
  exec: () => Promise<Array<string>>;
  write: () => ISparkyChain;
  bumpVersion: (mask: string | RegExp, opts: IBumpVersion) => ISparkyChain;
  contentsOf: (mask: string | RegExp, fn: (contents: string) => string) => ISparkyChain;
  dest: (target: string, base: string) => ISparkyChain;
}
export function sparkyChain(log: ILogger): ISparkyChain {
  const activities = [];
  const readFiles = {};
  let newLocation, newLocationBase;

  const runActivities = async () => {
    let latest: any;
    for (const fn of activities) {
      latest = await fn(latest);
    }

    if (newLocation && newLocationBase) {
      const root = ensureAbsolutePath(newLocation, env.APP_ROOT);
      for (const i in latest) {
        const file = latest[i];

        readFiles[file] = readFiles[file] || readFile(file);

        const s = ensureFuseBoxPath(file).split(newLocationBase);
        if (!s[1]) {
          log.error(`Can't find base of ${newLocationBase} of ${file}`);
          return;
        } else {
          const newFileLocation = path.join(root, s[1]);
          ensureDir(path.dirname(newFileLocation));
          writeFile(newFileLocation, readFiles[file]);
        }
      }
    }
    return latest;
  };
  const chain = {
    __scope: () => {
      return { readFiles };
    },
    // grabs the files by glob
    src: (glob: string) => {
      activities.push(() => sparky_src(glob));
      return chain;
    },

    // filters out unwanted files
    // accepts function and a regexp
    filter: input => {
      activities.push((files: Array<string>) => {
        const filtered = files.filter(file => {
          if (typeof input === 'function') {
            return !!input(file);
          } else if (input && typeof input.test === 'function') {
            return input.test(file);
          }
          return true;
        });

        return filtered;
      });
      return chain;
    },
    clean: () => {
      activities.push(async (files: Array<string>) => {
        files.forEach(file => {
          removeFile(file);
        });
        return files;
      });
      return chain;
    },
    bumpVersion: (mask: string | RegExp, opts: IBumpVersion) => {
      const re: RegExp = typeof mask === 'string' ? simplifiedRegExp(mask) : mask;
      activities.push(async (files: Array<string>) => {
        const target = files.find(file => re.test(file));
        if (target) {
          readFiles[target] = readFiles[target] || readFile(target);
          readFiles[target] = bumpVersion(readFiles[target], opts);
        }
        return files;
      });
      return chain;
    },
    // can be used to replace the contents of a file
    contentsOf: (mask: string | RegExp, fn: (contents: string) => string) => {
      const re: RegExp = typeof mask === 'string' ? simplifiedRegExp(mask) : mask;
      activities.push(async (files: Array<string>) => {
        const target = files.find(file => re.test(file));
        if (target) {
          readFiles[target] = readFiles[target] || readFile(target);
          readFiles[target] = fn(readFiles[target]);
        }
        return files;
      });
      return chain;
    },
    write: () => {
      activities.push(async (files: Array<string>) => {
        const _ = [];
        for (const file in readFiles) {
          _.push(writeFile(file, readFiles[file]));
        }
        return Promise.all(_).then(() => {
          return files;
        });
      });
      return chain;
    },
    tsc: (options?: TscOptions) => {
      activities.push(async (files: Array<string>) => {
        await tsc({ files: files, ...options });
      });
      return chain;
    },
    // runs all the activities (used mainly for testing)
    exec: async () => runActivities(),
    dest: (target: string, base: string) => {
      newLocation = target;
      newLocationBase = base;
      return chain;
    },
  };
  return chain;
}
