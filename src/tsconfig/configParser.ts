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

  let userOptions: IRawCompilerOptions = {};
  let customTsConfigPath;
  if (typeof props.tsConfig === 'string' && !fileExists(props.tsConfig)) {
    props.ctx && props.ctx.log.error('tsconfig was not found at $path', { path: props.tsConfig });
  } else customTsConfigPath = props.tsConfig;
  let extendedFile;
  if (typeof customTsConfigPath === 'string') {
    props.ctx && props.ctx.log.progressFormat('tsconfig', customTsConfigPath);
    const data: IRawTypescriptConfig = ts.readConfigFile(customTsConfigPath, ts.sys.readFile);
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
      props.ctx && props.ctx.log.progressFormat('tsconfig', result.filePath);
      basePath = path.dirname(result.filePath);
      const data: IRawTypescriptConfig = ts.readConfigFile(result.filePath, ts.sys.readFile);
      userOptions = data.config.compilerOptions;
      extendedFile = data.config.extends;
    } else {
      props.ctx && props.ctx.log.warn('tsconfig was not found. Make sure to create one');
    }
  }

  if (!basePath) {
    props.ctx && props.ctx.log.warn('tsconfig was not found. Make sure to create one');
    basePath = path.dirname(require.main.filename);
  }

  userOptions.module = 'commonjs';
  userOptions.moduleResolution = 'node';
  userOptions.importHelpers = true;
  userOptions.experimentalDecorators = true;
  userOptions.allowJs = true;

  if (extendedFile) {
    const targetExtendedFile = path.join(basePath, extendedFile);
    // read extended json
    let extendedJSON;

    try {
      extendedJSON = require(targetExtendedFile);
      basePath = path.dirname(targetExtendedFile);
    } catch (e) {
      props.ctx.fatal([`Unable to extend tsconfig with ${extendedFile}`, 'Make sure the file exists and readable']);
    }
    // overriding baseURL and paths
    if (extendedJSON.compilerOptions) {
      if (extendedJSON.compilerOptions.baseUrl) {
        userOptions.baseUrl = extendedJSON.compilerOptions.baseUrl;
      }
      if (extendedJSON.compilerOptions.paths) {
        userOptions.paths = extendedJSON.compilerOptions.paths;
      }
    }
  }
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
    typescriptPaths: typescriptPaths,
    basePath,
    jsonCompilerOptions: userOptions,
    compilerOptions: config.options,
  };
}
