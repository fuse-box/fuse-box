import { simplifiedRegExp } from '../plugins/pluginUtils';
import { readFile } from '../utils/utils';
import { sparky_src } from './sparky_src';
import { tsc, TscOptions } from './tsc';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { IRawCompilerOptions } from '../interfaces/TypescriptInterfaces';
import { createConfig } from '../config/config';
import { env } from '../core/env';
import { tsTransform } from '../transform/tsTransform';
export interface ISparkyChain {
  src: (glob: string) => ISparkyChain;
  tsc: (opts: TscOptions) => ISparkyChain;
  filter: (a: RegExp | ((file: string) => any)) => ISparkyChain;
  exec: () => Promise<Array<string>>;
  contentsOf: (mask: string | RegExp, fn: (contents: string) => string) => ISparkyChain;
  dest: (target: string) => Promise<any>;
}
export function sparkyChain(): ISparkyChain {
  const activities = [];
  const readFiles = {};

  const runActivities = async () => {
    let latest: any;
    for (const fn of activities) {
      latest = await fn(latest);
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
    tsc: (options?: IRawCompilerOptions) => {
      // const config = initTypescriptConfig(createConfig({ tsConfig: options }), env.SCRIPT_PATH);
      // config.compilerOptions;

      activities.push(async (files: Array<string>) => {
        await tsc({ files: files, target: 'ES2017' });
        // for (const file of files) {
        //   readFiles[file] = readFiles[file] || readFile(file);
        //   const response = await tsTransform({
        //     compilerOptions: config.compilerOptions,
        //     input: readFiles[file],
        //     fileName: file,
        //   });
        //   console.log(response);
        // }
      });
      return chain;
    },
    // runs all the activities (used mainly for testing)
    exec: async () => runActivities(),
    dest: async (target: string) => {
      let latest: any;
      for (const fn of activities) {
        latest = await fn(latest);
      }
    },
  };
  return chain;
}
