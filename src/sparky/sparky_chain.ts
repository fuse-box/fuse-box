import * as path from 'path';
import { env } from '../env';
import { FuseBoxLogAdapter } from '../fuseLog/FuseBoxLogAdapter';
import {
  ensureAbsolutePath,
  ensureDir,
  ensureFuseBoxPath,
  path2RegexPattern,
  readFile,
  readFileAsBuffer,
  removeFile,
  writeFile,
} from '../utils/utils';
import { bumpVersion, IBumpVersion } from './bumpVersion';
import { sparky_src } from './sparky_src';
import { TscOptions, tsc } from './tsc';
export interface ISparkyChain {
  bumpVersion: (mask: RegExp | string, opts: IBumpVersion) => ISparkyChain;
  clean: () => ISparkyChain;
  contentsOf: (mask: RegExp | string, fn: (contents: string) => string) => ISparkyChain;
  dest: (target: string, base: string) => ISparkyChain;
  exec: () => Promise<Array<string>>;
  filter: (a: ((file: string) => any) | RegExp) => ISparkyChain;
  src: (glob: string) => ISparkyChain;
  tsc: (opts: TscOptions) => ISparkyChain;
  write: () => ISparkyChain;
}
export function sparkyChain(log: FuseBoxLogAdapter): ISparkyChain {
  const activities = [];
  const readFiles = {};
  let newLocation, newLocationBase;

  const runActivities = async () => {
    let latest: any;
    for (const fn of activities) {
      latest = await fn(latest);
    }

    if (newLocation && newLocationBase) {
      const root = ensureAbsolutePath(newLocation, env.SCRIPT_PATH);
      for (const i in latest) {
        const file = latest[i];

        readFiles[file] = readFiles[file] || readFileAsBuffer(file);
        // normalize path so split works with windows path
        const s = path.normalize(ensureFuseBoxPath(file)).split(path.normalize(newLocationBase));
        if (!s.length || !s[s.length -1]) {
          log.error(`Can't find base of ${newLocationBase} of ${file}`);
          return;
        } else {
          const newFileLocation = path.join(root, s[s.length -1]);
          ensureDir(path.dirname(newFileLocation));
          await writeFile(newFileLocation, readFiles[file]);
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

    bumpVersion: (mask: RegExp | string, opts: IBumpVersion) => {
      const re: RegExp = typeof mask === 'string' ? path2RegexPattern(mask) : mask;
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
    clean: () => {
      activities.push(async (files: Array<string>) => {
        files.forEach(file => {
          removeFile(file);
        });
        return files;
      });
      return chain;
    },
    // can be used to replace the contents of a file
    contentsOf: (mask: RegExp | string, fn: (contents: string) => string) => {
      const re: RegExp = typeof mask === 'string' ? path2RegexPattern(mask) : mask;
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
    dest: (target: string, base: string) => {
      newLocation = target;
      newLocationBase = base;
      return chain;
    },
    // runs all the activities (used mainly for testing)
    exec: async () => runActivities(),
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
    tsc: (options?: TscOptions) => {
      activities.push(async (files: Array<string>) => {
        await tsc({ files: files, ...options });
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
  };
  return chain;
}
