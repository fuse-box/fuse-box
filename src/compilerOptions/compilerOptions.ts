import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as ts from 'typescript';
import { Context } from '../core/context';
import { env } from '../env';
import { ensureAbsolutePath } from '../utils/utils';
import { findTsConfig } from './findTSConfig';
import { ICompilerOptions, IRawCompilerOptions, IRawTypescriptConfig } from './interfaces';
export function createCompilerOptions(ctx: Context): ICompilerOptions {
  let options = ctx.config.compilerOptions || {};

  if (!options.jsxFactory) options.jsxFactory = 'React.createElement';
  if (options.esModuleInterop === undefined) options.esModuleInterop = true;
  if (options.esModuleStatement === undefined) options.esModuleStatement = true;
  options.processEnv = ctx.config.env;
  options.buildTarget = ctx.config.target;

  let tsConfigPath;

  // setting up a path to the user specific tsconfig.json
  if (options.tsConfig) {
    if (typeof options.tsConfig !== 'string') {
      throw new Error('tsConfig accepts a path only');
    }
    tsConfigPath = ensureAbsolutePath(options.tsConfig, env.SCRIPT_PATH);
  } else {
    const fileName = ctx.config.entries[0];
    tsConfigPath = findTsConfig({ fileName: fileName, root: appRoot.path });
  }

  let baseURL = options.baseUrl;
  let tsConfigDirectory;
  if (tsConfigPath) {
    const data: IRawTypescriptConfig = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
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
        const targetExtendedFile = path.join(tsConfigDirectory, tsConfig.extends);
        const extendedData: IRawTypescriptConfig = ts.readConfigFile(targetExtendedFile, ts.sys.readFile);

        if (extendedData.error) {
          let message = 'Error while initializing tsconfig';
          ctx.fatal('tsconfig extends error', [data.error.messageText || message]);
        }
        if (extendedData.config) {
          if (extendedData.config.compilerOptions) {
            if (extendedData.config.compilerOptions.baseUrl && !baseURL) {
              tsConfigDirectory = path.dirname(targetExtendedFile);
              baseURL = extendedData.config.compilerOptions.baseUrl;
            }
            for (const key in extendedData.config.compilerOptions) {
              tsConfigCompilerOptions[key] = extendedData.config.compilerOptions[key];
            }
          }
        }
      }
      if (tsConfig.compilerOptions) {
        const tsConfigCompilerOptions = tsConfig.compilerOptions;

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
    }
  }
  if (baseURL) options.baseUrl = path.resolve(tsConfigDirectory, baseURL);

  return options;
}
