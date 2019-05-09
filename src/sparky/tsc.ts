import { spawn } from 'child_process';
import { ensureAbsolutePath } from '../utils/utils';
import { env } from '../core/env';
import * as path from 'path';

export type Libs =
  | 'ES5'
  | 'ES6'
  | 'ES2015'
  | 'ES7'
  | 'ES2016'
  | 'ES2017'
  | 'ESNext'
  | 'DOM'
  | 'DOM.Iterable'
  | 'WebWorker'
  | 'ScriptHost'
  | 'ES2015.Core'
  | 'ES2015.Collection'
  | 'ES2015.Generator'
  | 'ES2015.Iterable'
  | 'ES2015.Promise'
  | 'ES2015.Proxy'
  | 'ES2015.Reflect'
  | 'ES2015.Symbol'
  | 'ES2015.Symbol.WellKnown'
  | 'ES2016.Array.Include'
  | 'ES2017.object'
  | 'ES2017.SharedMemory'
  | 'ES2017.TypedArrays'
  | 'esnext.asynciterable';

export interface TscOptions {
  files?: Array<string>;
  allowJs?: boolean;
  allowSyntheticDefaultImports?: boolean;
  allowUnreachableCode?: boolean;
  allowUnusedLabels?: boolean;
  alwaysStrict?: boolean;
  baseUrl?: string;
  charset?: string;
  checkJs?: boolean;
  declaration?: boolean;
  declarationDir?: string;
  diagnostics?: boolean;
  disableSizeLimit?: boolean;
  downlevelIteration?: boolean;
  emitBOM?: boolean;
  emitDecoratorMetadata?: boolean;
  experimentalDecorators?: boolean;
  forceConsistentCasingInFileNames?: boolean;
  importHelpers?: boolean;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;
  init?: boolean;
  isolatedModules?: boolean;
  jsx?: 'Preserve' | 'React';
  jsxFactory?: string;
  lib?: Array<Libs>;
  listEmittedFiles?: boolean;
  listFiles?: boolean;
  locale?: 'en' | 'cs' | 'de' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'pl' | 'pt-BR' | 'ru' | 'tr' | 'zh-CN' | 'zh-TW';
  mapRoot?: string;
  maxNodeModuleJsDepth?: number;
  module?: 'None' | 'CommonJS' | 'AMD' | 'System' | 'UMD' | 'ES6' | 'ES2015' | 'ESNext';
  moduleResolution?: 'Node' | 'Classic';
  newLine?: 'crlf' | 'lf';
  noEmit?: boolean;
  noEmitHelpers?: boolean;
  noEmitOnError?: boolean;
  noFallthroughCasesInSwitch?: boolean;
  noImplicitAny?: boolean;
  noImplicitReturns?: boolean;
  noImplicitThis?: boolean;
  noImplicitUseStrict?: boolean;
  noLib?: boolean;
  noResolve?: boolean;
  noStrictGenericChecks?: boolean;
  noUnusedLocals?: boolean;
  noUnusedParameters?: boolean;
  outDir?: string;
  outFile?: string;
  preserveConstEnums?: boolean;
  preserveSymlinks?: boolean;
  pretty?: boolean;
  project?: string;
  reactNamespace?: string;
  removeComments?: boolean;
  rootDir?: string;
  skipDefaultLibCheck?: boolean;
  skipLibCheck?: boolean;
  sourceMap?: boolean;
  sourceRoot?: boolean;
  strict?: boolean;
  strictFunctionTypes?: boolean;
  strictNullChecks?: boolean;
  stripInternal?: boolean;
  suppressExcessPropertyErrors?: boolean;
  suppressImplicitAnyIndexErrors?: boolean;
  target?: 'ES3' | 'ES5' | 'ES6' | 'ES2015' | 'ES2016' | 'ES2017' | 'ESNext';
  traceResolution?: boolean;
  types?: string[];
  typeRoots?: string[];
  watch?: boolean;
}

export async function tsc(opts?: TscOptions) {
  let tscOptions: any = [];

  if (opts.project) {
    opts.project = ensureAbsolutePath(opts.project, path.dirname(env.SCRIPT_FILE));
  }

  if (opts.files) {
    tscOptions = tscOptions.concat(opts.files);
    delete opts.files;
  }
  for (const key in opts) {
    if (opts[key] !== undefined) {
      if (key === 'watch') {
        tscOptions.push(`--${key}`);
      } else {
        tscOptions.push(`--${key}`, String(opts[key]));
      }
    }
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('tsc' + (/^win/.test(process.platform) ? '.cmd' : ''), tscOptions, {
      stdio: 'inherit',
    });
    proc.on('close', function(code) {
      if (code === 8) {
        return reject('Error detected');
      }
      return resolve();
    });
  });
}
