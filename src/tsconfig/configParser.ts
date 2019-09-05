import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as ts from 'typescript';
import { PrivateConfig } from '../config/PrivateConfig';
import { IRawCompilerOptions, IRawTypescriptConfig, TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { ITypescriptPathsConfig } from '../resolver/resolver';
import { fileExists, pathJoin } from '../utils/utils';

export function resolveTSConfig(props: {
  root: string;
  directory?: string;
  fileName?: string;
}): { iterations: number; filePath?: string } {
  let [found, reachedLimit] = [false, false];

  let current = props.fileName ? path.dirname(props.fileName) : props.directory;
  let iterations = 0;
  const maxIterations = 20;

  while (found === false && reachedLimit === false) {
    let filePath = path.join(current, 'tsconfig.json');
    if (fileExists(filePath)) {
      return { iterations, filePath };
    }

    if (props.root === current) {
      reachedLimit = true;
    }
    // going backwards
    current = path.join(current, '..');
    // Making sure we won't have any perpetual loops here
    iterations = iterations + 1;
    if (iterations >= maxIterations) {
      reachedLimit = true;
    }
  }
  return { iterations };
}

export function initTypescriptConfig(
  props: PrivateConfig,
  configScriptPath?: string, // fuse.js or fuse.ts
): TypescriptConfig {
  let basePath: string = configScriptPath;

  let tsConfigFilePath;

  let userOptions: IRawCompilerOptions = {};
  let customTsConfigPath;
  if (typeof props.tsConfig === 'string' && !fileExists(props.tsConfig)) {
    // TODO: should die in pain
  } else customTsConfigPath = props.tsConfig;
  let extendedFile;
  if (typeof customTsConfigPath === 'string') {
    const data: IRawTypescriptConfig = ts.readConfigFile(customTsConfigPath, ts.sys.readFile);
    tsConfigFilePath = customTsConfigPath;
    basePath = path.dirname(customTsConfigPath);
    userOptions = data.config.compilerOptions;
    extendedFile = data.config.extends;
  } else if (typeof props.tsConfig === 'object') {
    userOptions = props.tsConfig;
  } else if (!props.tsConfig && props.entries && props.homeDir) {
    const root = appRoot.path;
    const fileName = pathJoin(props.homeDir, props.entries[0]);
    const result = resolveTSConfig({ root: root, fileName: fileName });
    if (result.filePath) {
      tsConfigFilePath = result.filePath;
      basePath = path.dirname(result.filePath);
      const data: IRawTypescriptConfig = ts.readConfigFile(result.filePath, ts.sys.readFile);
      userOptions = data.config.compilerOptions;
      extendedFile = data.config.extends;
    }
  }
  let baseUrlSet = false;
  if (userOptions && userOptions.baseUrl) {
    baseUrlSet = true;
  }
  if (!basePath) {
    props.ctx && props.ctx.log.info('tsconfig.json was not found. Using internal defaults.');
    basePath = path.dirname(require.main.filename);
  }

  // read extended json
  if (extendedFile) {
    const targetExtendedFile = path.join(basePath, extendedFile);
    try {
      const extendedJSON = require(targetExtendedFile);

      // bring in config from extended, but base do not override main
      if (extendedJSON.compilerOptions) {
        userOptions = Object.assign(extendedJSON.compilerOptions, userOptions);
      }

      // we have this to fix basepath for paths
      // but we do not use this if basepath is set in main config
      if (!baseUrlSet) {
        basePath = path.dirname(targetExtendedFile);
      }
    } catch (e) {
      props.ctx.log.warn(`Unable to extend tsconfig with ${extendedFile}. Make sure the file exists and readable`);
    }
  }

  // set standard fields after we have combined extended if there was any
  userOptions.module = 'commonjs';
  userOptions.moduleResolution = 'node';
  userOptions.importHelpers = true;
  userOptions.experimentalDecorators = true;
  userOptions.allowJs = true;

  if (!userOptions.jsx) {
    userOptions.jsx = 'react';
  }
  if (!props.production) {
    userOptions.target = 'ESNext';
  } else {
    if (!userOptions.target) {
      userOptions.target = 'ES2017';
    }

    if (props.production.target) {
      userOptions.target = props.production.target;
    }
  }

  delete userOptions.mod;

  let typescriptPaths: ITypescriptPathsConfig;
  if (userOptions.baseUrl) {
    typescriptPaths = {
      baseURL: path.resolve(basePath, userOptions.baseUrl),
      paths: userOptions.paths,
    };
  }

  const config = ts.convertCompilerOptionsFromJson(userOptions, basePath);

  return {
    tsConfigFilePath,
    typescriptPaths: typescriptPaths,
    basePath,
    jsonCompilerOptions: userOptions,
    compilerOptions: config.options,
  };
}
