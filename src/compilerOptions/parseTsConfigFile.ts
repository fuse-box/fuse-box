import * as path from 'path';
import * as ts from 'typescript';
import { ITypescriptPathsConfig } from '../resolver/resolver';
import { IRawCompilerOptions, IRawTypescriptConfig } from './interfaces';

export function parseTsConfigFile(filePath: string) {
  const data: IRawTypescriptConfig = ts.readConfigFile(filePath, ts.sys.readFile);

  const compilerOptions: IRawCompilerOptions = data.config.compilerOptions || {};

  const thisConfigDir = path.dirname(filePath);

  let baseUrlSet = false;
  if (compilerOptions.baseUrl) {
    if (!path.isAbsolute(compilerOptions.baseUrl)) {
      compilerOptions.baseUrl = path.join(thisConfigDir, compilerOptions.baseUrl);
    }
    baseUrlSet = true;
  }

  if (data.config.extends) {
    const extendedConfigPath = path.join(thisConfigDir, data.config.extends);
    const extendedConfig: IRawTypescriptConfig = ts.readConfigFile(extendedConfigPath, ts.sys.readFile);
    const extOptions = extendedConfig.config.compilerOptions;
    if (extOptions) {
      for (const key in extOptions) {
        if (key === 'baseUrl') {
          if (!baseUrlSet) {
            compilerOptions.baseUrl = extOptions[key];
            if (!path.isAbsolute(compilerOptions.baseUrl)) {
              compilerOptions.baseUrl = path.join(path.dirname(extendedConfigPath), compilerOptions.baseUrl);
            }
          }
        } else {
          compilerOptions[key] = extOptions[key];
        }
      }
    }
  }
  let typescriptPaths: ITypescriptPathsConfig;
  if (compilerOptions.baseUrl) {
    typescriptPaths = { baseURL: compilerOptions.baseUrl, paths: compilerOptions.paths };
  }

  return { compilerOptions, typescriptPaths };
}
