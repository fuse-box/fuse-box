import * as path from 'path';
import { BUNDLE_RUNTIME_NAMES } from '../bundleRuntime/bundleRuntimeCore';
import { Context } from '../core/context';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';
import { findTsConfig } from './findTSConfig';
import { ICompilerOptions, IRawCompilerOptions } from './interfaces';
import { parseTypescriptConfig } from './parseTypescriptConfig';
import { getExtendedTsConfig } from './getExtendedTsConfig';

export function createCompilerOptions(ctx: Context): ICompilerOptions {
  let options = ctx.config.compilerOptions || {};

  if (!options.jsxFactory) options.jsxFactory = 'React.createElement';
  if (options.esModuleInterop === undefined) options.esModuleInterop = true;
  if (options.esModuleStatement === undefined) options.esModuleStatement = true;
  options.processEnv = ctx.config.env;
  options.buildTarget = ctx.config.target;

  if (!options.jsParser) options.jsParser = {};
  if (!options.jsParser.nodeModules) options.jsParser.nodeModules = 'meriyah';
  if (!options.jsParser.project) options.jsParser.project = 'ts';

  let tsConfigPath;

  // setting up a path to the user specific tsconfig.json
  if (options.tsConfig) {
    if (typeof options.tsConfig !== 'string') {
      throw new Error('tsConfig accepts a path only');
    }
    tsConfigPath = ensureAbsolutePath(options.tsConfig, env.SCRIPT_PATH);
  } else {
    const fileName = ctx.config.entries[0];
    tsConfigPath = findTsConfig({ fileName: fileName, root: env.APP_ROOT });
  }

  let baseURL = options.baseUrl;
  let tsConfigDirectory;

  if (tsConfigPath) {
    const data = parseTypescriptConfig(tsConfigPath);

    tsConfigDirectory = path.dirname(tsConfigPath);
    const tsConfig = data.config;

    if (data.error) {
      let message = 'Error while initializing tsconfig';
      ctx.fatal('tsconfig error', [data.error.messageText || message]);
    }

    if (tsConfig) {
      let tsConfigCompilerOptions: IRawCompilerOptions = {};

      if (tsConfig.compilerOptions) {
        tsConfigCompilerOptions = tsConfig.compilerOptions;

        if (tsConfigCompilerOptions.baseUrl) {
          baseURL = tsConfigCompilerOptions.baseUrl;
        }
      }

      if (tsConfig.extends) {

        /**
         * This 'getExtendedTsConfig' function can probably be used to simplify all this 'extends' code
         * significantly, because it merges all the extended configs into the resulting one.       
         */
        const [extendedData, extendedPath] = getExtendedTsConfig(data, tsConfigDirectory);

        if (extendedData.error) {
          let message = 'Error while initializing tsconfig';
          ctx.fatal('tsconfig extends error', [extendedData.error.messageText || message]);
        }

        const extendedOptions = extendedData.config?.compilerOptions;

        if (extendedOptions) {
          if (extendedOptions.baseUrl && !baseURL) {
            tsConfigDirectory = extendedPath;
            baseURL = extendedOptions.baseUrl;
          }

          for (const key in extendedOptions) {
            tsConfigCompilerOptions[key] = extendedOptions[key];
          }
        }
      }

      if (tsConfig.compilerOptions) {
        const tsConfigCompilerOptions = tsConfig.compilerOptions;

        if (tsConfigCompilerOptions.paths) options.paths = tsConfigCompilerOptions.paths;

        // to keep it compatible with the old versions
        if (tsConfigCompilerOptions.allowSyntheticDefaultImports) options.esModuleInterop = true;

        // esModuleInterop has more weight over allowSyntheticDefaultImports
        if (tsConfigCompilerOptions.esModuleInterop !== undefined)
          options.esModuleInterop = tsConfigCompilerOptions.esModuleInterop;

        if (tsConfigCompilerOptions.experimentalDecorators !== undefined)
          options.experimentalDecorators = tsConfigCompilerOptions.experimentalDecorators;

        if (tsConfigCompilerOptions.emitDecoratorMetadata !== undefined)
          options.emitDecoratorMetadata = tsConfigCompilerOptions.emitDecoratorMetadata;

        if (tsConfigCompilerOptions.jsxFactory) options.jsxFactory = tsConfigCompilerOptions.jsxFactory;
      }

      options.tsReferences = tsConfig.references;
    }
  }
  if (baseURL) options.baseUrl = path.resolve(tsConfigDirectory, baseURL);

  if (options.buildEnv === undefined) {
    options.buildEnv = {};
  }

  if (!options.transformers) options.transformers = [];
  // set default helplers
  options.buildEnv.require = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ + '.' + BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION;
  options.buildEnv.cachedModules = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ + '.' + BUNDLE_RUNTIME_NAMES.CACHE_MODULES;
  return options;
}
