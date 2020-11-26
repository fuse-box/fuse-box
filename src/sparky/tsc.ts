import { spawn } from 'child_process';
import { env } from '../env';

export type Libs =
  | 'DOM'
  | 'DOM.Iterable'
  | 'ES2015'
  | 'ES2015.Collection'
  | 'ES2015.Core'
  | 'ES2015.Generator'
  | 'ES2015.Iterable'
  | 'ES2015.Promise'
  | 'ES2015.Proxy'
  | 'ES2015.Reflect'
  | 'ES2015.Symbol'
  | 'ES2015.Symbol.WellKnown'
  | 'ES2016'
  | 'ES2016.Array.Include'
  | 'ES2017'
  | 'ES2017.SharedMemory'
  | 'ES2017.TypedArrays'
  | 'ES2017.object'
  | 'ES5'
  | 'ES6'
  | 'ES7'
  | 'ESNext'
  | 'ScriptHost'
  | 'WebWorker'
  | 'esnext.asynciterable';

export interface TscOptions {
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
  exclude?: Array<string>;
  experimentalDecorators?: boolean;
  files?: Array<string>;
  forceConsistentCasingInFileNames?: boolean;
  importHelpers?: boolean;
  init?: boolean;
  inlineSourceMap?: boolean;
  inlineSources?: boolean;
  isolatedModules?: boolean;
  jsx?: 'Preserve' | 'React';
  jsxFactory?: string;
  lib?: Array<Libs>;
  listEmittedFiles?: boolean;
  listFiles?: boolean;
  locale?: 'cs' | 'de' | 'en' | 'es' | 'fr' | 'it' | 'ja' | 'ko' | 'pl' | 'pt-BR' | 'ru' | 'tr' | 'zh-CN' | 'zh-TW';
  mapRoot?: string;
  maxNodeModuleJsDepth?: number;
  module?: 'AMD' | 'CommonJS' | 'ES2015' | 'ES6' | 'ESNext' | 'None' | 'System' | 'UMD';
  moduleResolution?: 'Classic' | 'Node';
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
  target?: 'ES2015' | 'ES2016' | 'ES2017' | 'ES3' | 'ES5' | 'ES6' | 'ESNext';
  traceResolution?: boolean;
  typeRoots?: string[];
  types?: string[];
  watch?: boolean;
}

export async function tsc(opts?: TscOptions, target?: Array<string> | string): Promise<void> {
  let tscOptions: any = [];

  for (const key in opts) {
    if (opts[key] !== undefined) {
      if (key === 'watch') {
        tscOptions.push(`--${key}`);
      } else {
        tscOptions.push(`--${key}`, String(opts[key]));
      }
    }
  }
  if (target) {
    const files = [].concat(target);
    for (const f of files) tscOptions.push(f);
  }

  return new Promise((resolve, reject) => {
    const proc = spawn('tsc' + (/^win/.test(process.platform) ? '.cmd' : ''), tscOptions, {
      cwd: env.SCRIPT_PATH,
      stdio: 'ignore',
    });
    proc.on('close', function(code) {
      if (code === 8) {
        return reject('Error detected');
      }
      return resolve();
    });
  });
}
