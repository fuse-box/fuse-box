import * as path from 'path';
import * as fs from 'fs';
import { getFolderEntryPointFromPackageJSON } from './shared';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { fileExists } from '../utils/utils';
import { findUp } from '../utils/findUp';

export interface ILookupProps {
  typescriptFirst?: boolean;
  javascriptFirst?: boolean;
  isDev?: boolean;
  fileDir?: string;
  filePath?: string;
  target: string;
  inBaseUrl?: boolean;
}

export interface TsConfigAtPath {
  absPath: string;
  tsConfig: TypescriptConfig;
}

export interface ILookupResult {
  isDirectoryIndex?: boolean;
  fileExists: boolean;
  absPath: string;
  extension?: string;
  monorepoModulesPaths?: string;
  tsConfigAtPath?: TsConfigAtPath;
  customIndex?: boolean;
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
        extension: path.extname(resolved),
        absPath: resolved,
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
    isDirectory = stat.isDirectory();

    if (isDirectory) {
      if (props.inBaseUrl !== true) {
        let monorepoModulesPaths;
        let tsConfigAtPath: TsConfigAtPath;
        // only in case of a directory
        const projectRoot = path.join(resolved, "../../../"); // TODO: get the actual projectRoot
        const packageJSONPath = findUp(resolved, 'package.json', {
          boundary: projectRoot,
          inclusive: false,
        });
        const packageRoot = path.dirname(packageJSONPath)
        if (fileExists(packageJSONPath)) {
          const useLocalMain = !/node_modules/.test(packageJSONPath);
          const packageJSON = require(packageJSONPath);
          const entry = getFolderEntryPointFromPackageJSON({ json: packageJSON, useLocalField: useLocalMain });

          if (packageJSON['main:local']) {
            console.error(`Found "main:local" in package.json.  Should be "local:main"`);
          }

          if (useLocalMain && packageJSON['local:main']) {
            const _monoModules = path.resolve(packageRoot, 'node_modules');
            if (fileExists(_monoModules)) {
              monorepoModulesPaths = _monoModules;
            }

            const _tsConfig = findUp(resolved, 'tsconfig.json', {
              boundary: projectRoot,
              inclusive: false,
            });
            if (fileExists(_tsConfig)) {
              const props: any = { tsConfig: _tsConfig };
              const _tsConfigObject = initTypescriptConfig(props);
              tsConfigAtPath = { absPath: _tsConfig, tsConfig: _tsConfigObject };
            }
          }

          const entryFile = path.join(resolved, entry);
          return {
            customIndex: true,
            monorepoModulesPaths,
            tsConfigAtPath,
            isDirectoryIndex: true,
            absPath: entryFile,
            extension: path.extname(entryFile),
            fileExists: fileExists(entryFile),
          };
        }
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
          isDirectoryIndex: true,
          absPath: directoryIndex,
          extension: path.extname(directoryIndex),
          fileExists: true,
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
        customIndex: true, // it still needs to be re-written because FuseBox client API won't find it
        absPath: targetFile,
        extension: path.extname(targetFile),
        fileExists: true,
      };
    }
  }
  return {
    fileExists: false,
    absPath: resolved,
  };
}
