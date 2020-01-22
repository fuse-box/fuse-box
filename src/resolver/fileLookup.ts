import * as fs from 'fs';
import * as path from 'path';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { fileExists } from '../utils/utils';
import { getFolderEntryPointFromPackageJSON } from './shared';

export interface ILookupProps {
  fileDir?: string;
  filePath?: string;
  isDev?: boolean;
  javascriptFirst?: boolean;
  target: string;
  typescriptFirst?: boolean;
}

export interface TsConfigAtPath {
  absPath: string;
  tsConfig: TypescriptConfig;
}

export interface ILookupResult {
  absPath: string;
  customIndex?: boolean;
  extension?: string;
  fileExists: boolean;
  isDirectoryIndex?: boolean;
  monorepoModulesPaths?: string;
  tsConfigAtPath?: TsConfigAtPath;
}

const JS_INDEXES = ['index.js', 'index.jsx'];
const TS_INDEXES = ['index.ts', 'index.tsx'];
const TS_INDEXES_FIRST = [...TS_INDEXES, ...JS_INDEXES];
const JS_INDEXES_FIRST = [...JS_INDEXES, ...TS_INDEXES];

const JS_EXTENSIONS = ['.js', '.jsx', '.mjs'];
const TS_EXTENSIONS = ['.ts', '.tsx'];

const TS_EXTENSIONS_FIRST = [...TS_EXTENSIONS, ...JS_EXTENSIONS];
const JS_EXTENSIONS_FIRST = [...JS_EXTENSIONS, ...TS_EXTENSIONS];

function tryIndexes(target: string, indexes: Array<string>) {
  for (const i in indexes) {
    const indexFile = indexes[i];
    const resolved = path.join(target, indexFile);
    if (fileExists(resolved)) {
      return resolved;
    }
  }
}

function tryExtensions(target: string, extensions: Array<string>) {
  for (const i in extensions) {
    const resolved = `${target}${extensions[i]}`;
    if (fileExists(resolved)) {
      return resolved;
    }
  }
}

export function fileLookup(props: ILookupProps): ILookupResult {
  if (!props.fileDir && !props.filePath) {
    throw new Error('Failed to lookup. Provide either fileDir or filePath');
  }
  let resolved = path.join(props.filePath ? path.dirname(props.filePath) : props.fileDir, props.target);
  const extension = path.extname(resolved);

  if (extension && fileExists(resolved)) {
    const stat = fs.lstatSync(resolved);

    if (stat.isFile()) {
      return {
        absPath: resolved,
        extension: path.extname(resolved),
        fileExists: fileExists(resolved),
      };
    }
  }

  // try files without extensions first
  let fileExtensions: Array<string> = TS_EXTENSIONS_FIRST;
  if (props.javascriptFirst) {
    fileExtensions = JS_EXTENSIONS_FIRST;
  }
  if (props.typescriptFirst) {
    fileExtensions = TS_EXTENSIONS_FIRST;
  }
  const targetFile = tryExtensions(resolved, fileExtensions);
  if (targetFile) {
    return {
      absPath: targetFile,
      extension: path.extname(targetFile),
      fileExists: true,
    };
  }

  let isDirectory: boolean;
  // try directory indexes
  const exists = fileExists(resolved);
  if (exists) {
    const stat = fs.lstatSync(resolved);
    if (stat.isDirectory) {
      isDirectory = true;

      let monorepoModulesPaths;
      let tsConfigAtPath: TsConfigAtPath;

      // only in case of a directory
      const packageJSONPath = path.join(resolved, 'package.json');
      if (fileExists(packageJSONPath)) {
        const useLocalMain = !/node_modules/.test(packageJSONPath);
        const packageJSON = require(packageJSONPath);
        const entry = getFolderEntryPointFromPackageJSON({ json: packageJSON, useLocalField: useLocalMain });

        if (useLocalMain && packageJSON['local:main']) {
          const _monoModules = path.resolve(resolved, 'node_modules');
          if (fileExists(_monoModules)) {
            monorepoModulesPaths = _monoModules;
          }

          // const _tsConfig = path.resolve(resolved, 'tsconfig.json');
          // if (fileExists(_tsConfig)) {
          //   const props: any = { tsConfig: _tsConfig };
          //   const _tsConfigObject = initTypescriptConfig(props);
          //   tsConfigAtPath = { absPath: resolved, tsConfig: _tsConfigObject };
          // }
        }

        const entryFile = path.join(resolved, entry);
        return {
          absPath: entryFile,
          customIndex: true,
          extension: path.extname(entryFile),
          fileExists: fileExists(entryFile),
          isDirectoryIndex: true,
          monorepoModulesPaths,
          tsConfigAtPath,
        };
      }

      let indexes: Array<string> = TS_INDEXES_FIRST;
      if (props.javascriptFirst) {
        indexes = JS_INDEXES_FIRST;
      }
      if (props.typescriptFirst) {
        indexes = TS_INDEXES_FIRST;
      }
      const directoryIndex = tryIndexes(resolved, indexes);
      if (directoryIndex) {
        return {
          absPath: directoryIndex,
          extension: path.extname(directoryIndex),
          fileExists: true,
          isDirectoryIndex: true,
        };
      }
    }
  }

  // as a last resort, we should try ".json" which is a very rare case
  // that's why it has the lowest priority here
  if (!isDirectory) {
    const targetFile = tryExtensions(resolved, ['.json']);
    if (targetFile) {
      return {
        absPath: targetFile,
        customIndex: true, // it still needs to be re-written because FuseBox client API won't find it
        extension: path.extname(targetFile),
        fileExists: true,
      };
    }
  }
  return {
    absPath: resolved,
    fileExists: false,
  };
}
