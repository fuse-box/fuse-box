import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as ts from 'typescript';
import { PrivateConfig } from '../config/PrivateConfig';
import { IRawCompilerOptions, IRawTypescriptConfig, TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { fileExists, pathJoin } from '../utils/utils';
import { ITypescriptPathsConfig } from '../resolver/resolver';

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
  if (typeof props.tsConfig === 'string') {
    const data: IRawTypescriptConfig = ts.readConfigFile(props.tsConfig, ts.sys.readFile);
    basePath = path.dirname(props.tsConfig);
    userOptions = data.config.compilerOptions;
  } else if (typeof props.tsConfig === 'object') {
    userOptions = props.tsConfig;
  } else if (!props.tsConfig && props.entries && props.homeDir) {
    const root = appRoot.path;
    const fileName = pathJoin(props.homeDir, props.entries[0]);
    const result = resolveTSConfig({ root: root, fileName: fileName });
    if (result.filePath) {
      basePath = path.dirname(result.filePath);
      const data: IRawTypescriptConfig = ts.readConfigFile(result.filePath, ts.sys.readFile);
      userOptions = data.config.compilerOptions;
    }
  }

  if (!basePath) {
    basePath = path.dirname(require.main.filename);
  }
  userOptions.module = 'commonjs';
  userOptions.moduleResolution = 'node';
  userOptions.importHelpers = true;
  userOptions.experimentalDecorators = true;
  userOptions.allowJs = true;
  if (!userOptions.jsx) {
    userOptions.jsx = 'react';
  }
  if (!props.production) {
    userOptions.target = 'esnext';
  } else {
    if (!userOptions.target) {
      userOptions.target = 'es2017';
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
