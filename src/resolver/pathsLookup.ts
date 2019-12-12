import * as fs from 'fs';
import { fileLookup, ILookupResult, TsConfigAtPath } from './fileLookup';
import * as path from 'path';
import { findUp } from '../utils/findUp';
import { getFolderEntryPointFromPackageJSON } from './shared';
import { fileExists } from '../utils/utils';
import { initTypescriptConfig } from '../tsconfig/configParser';

export type ITypescriptPaths = { [key: string]: Array<string> };
interface IPathsLookupProps {
  homeDir: string;
  baseURL: string;
  isDev?: boolean;
  cachePaths?: boolean;
  paths?: ITypescriptPaths;
  target: string;
}

type DirectoryListing = Array<{ nameWithoutExtension: string; name: string }>;
type TypescriptPaths = Array<(target: string) => Array<string>>;
const CACHED_LISTING: { [key: string]: DirectoryListing } = {};
const CACHED_PATHS: { [key: string]: TypescriptPaths } = {};


/** Checks for a target as a path (relative or root).  Ex ("/sub-folder/item.ts") */
export function pathsLookup(props: IPathsLookupProps): ILookupResult {
  // if baseDir is the same as homeDir we can assume aliasing directories
  // and files without the need in specifying "paths"
  // so we check if first
  const indexFiles = getIndexFiles(props);
  console.log(indexFiles);
  if (indexFiles) {
    for (const item of indexFiles) {
      // check if starts with it only
      const regex = new RegExp(`^${item.nameWithoutExtension}($|\\.|\\/)`);
      if (regex.test(props.target)) {
        const result = fileLookup({ fileDir: props.baseURL, target: props.target });
        if (result && result.fileExists) {
          return result;
        }
      }
    }
  }

  // Performing the actual typescript paths match
  // "items" should be cached, so we are getting simple functions that contain
  // regular expressions
  const items = getPathsData(props);
  console.log(items);
  for (const test of items) {
    const directories = test(props.target);
    if (directories) {
      for (const directory of directories) {
        const result = fileLookup({ isDev: props.isDev, fileDir: props.baseURL, target: directory });
        if (result && result.fileExists) {
          return result;
        }
      }
    }
  }

  // if (props.typescriptPaths) {
  //   const startPath = path.join(props.typescriptPaths.baseURL, props.target);
  //   const packageJSONFile = findUp(startPath, 'package.json');
  //   return (packageJSONFile && path.dirname(packageJSONFile)) || undefined;
  // }

  const moduleName = props.target;
  if (props.paths) {
    const tsPaths = props.paths[moduleName];
    if (tsPaths) {
      for (let relativeTsPath of tsPaths) {
        const tsPath = path.join(props.baseURL, relativeTsPath);
        // will stop at the first shared parent between baseUrl and path
        const packageJSONPath = findUp(tsPath, 'package.json', {
          boundary: props.baseURL,
          inclusive: false
        });
        const packageRoot = path.dirname(packageJSONPath);
        const packageJSON = require(packageJSONPath);
        if (packageJSON) {
          const relativeEntry: string | undefined = getFolderEntryPointFromPackageJSON({ json: packageJSON, useLocalField: true });
          let absPath: string;
          let entry: string;
          if (!relativeEntry) {
            absPath = tsPath;
          } else {
            entry = path.join(packageRoot, relativeEntry);
            const entryDir = path.dirname(entry);
            const tsPathDir = path.dirname(tsPath);

            if (entryDir.indexOf(tsPathDir) !== -1 || tsPathDir.indexOf(entryDir) !== -1) {
              absPath = entryDir.length > tsPathDir.length ? entry : tsPath;
            } else {
              throw (`Entry point (${entryDir}) differs from tsConfig path (${tsPathDir}).
                Are you missing a "local:main" field in your package.json?`);
            }
          }

          let monorepoModulesPaths: string;
          let tsConfigAtPath: TsConfigAtPath;

          const _monoModules = path.resolve(packageRoot, 'node_modules');
          if (fileExists(_monoModules)) {
            monorepoModulesPaths = _monoModules;
          }
          const _tsConfig = path.join(packageRoot, 'tsconfig.json');
          if (fileExists(_tsConfig)) {
            const props: any = { tsConfig: _tsConfig };
            const _tsConfigObject = initTypescriptConfig(props);
            tsConfigAtPath = { absPath: _tsConfig, tsConfig: _tsConfigObject };
          }

          if (path.dirname(absPath) === absPath) {
            throw `Either tsconfig paths or package.json local:main must point to a file (not directory). "${absPath}"`;
          }

          const absPathIsValid = fileExists(absPath);
          if (!absPathIsValid) {
            if (absPath === entry) {
              throw `Entry path defined by package.json is not valid "${absPath}".  Make sure to use "local:main" for local development`
            } else {
              throw `Entry path defined by tsconfig.json is not valid "${absPath}".`
            }
          }

          return {
            customIndex: true,
            monorepoModulesPaths,
            tsConfigAtPath,
            isDirectoryIndex: true,
            absPath,
            extension: path.extname(absPath),
            fileExists: absPathIsValid,
          };
        }
      }
    }
  }
}





/// ---------------- NON EXPORTS --------------------

function pathRegex(input: string) {
  const str = input.replace(/\*/, '(.*)').replace(/[\-\[\]\/\{\}\+\?\\\^\$\|]/g, '\\$&');
  return new RegExp(`^${str}`);
}

/**
 * Compile a list of functions to easily test directories
 *
 * @param {string} homeDir
 * @param {{ [key: string]: Array<string> }} [paths]
 * @returns
 */
function getPathsData(props: IPathsLookupProps): TypescriptPaths {
  if (CACHED_PATHS[props.homeDir] && props.cachePaths) {
    return CACHED_PATHS[props.homeDir];
  }
  const fns: TypescriptPaths = [];
  for (const key in props.paths) {
    fns.push((target: string) => {
      const re = pathRegex(key);
      const matched = target.match(re);
      if (matched) {
        const variable = matched[1];
        const directories = props.paths[key];
        return directories.map(item => item.replace(/\*/, variable));
      }
    });
  }
  if (props.cachePaths) {
    CACHED_PATHS[props.homeDir] = fns;
  }

  return fns;
}

/**
 * Listing homeDir directories to simplify matching and make it easier for the matcher
 *
 * @param {IPathsLookupProps} props
 * @returns {(DirectoryListing | undefined)}
 */
function getIndexFiles(props: IPathsLookupProps): DirectoryListing | undefined {
  let indexFiles: Array<{ nameWithoutExtension: string; name: string }>;
  if (props.baseURL) {
    if (CACHED_LISTING[props.baseURL]) {
      indexFiles = CACHED_LISTING[props.baseURL];
    } else {
      const files = [];
      const listed = fs.readdirSync(props.baseURL);
      for (const file of listed) {
        if (file[0] === '.') {
          const [nameWithoutExtension] = file.split('.');
          files.push({
            nameWithoutExtension,
            name: file,
          });
        }
      }

      indexFiles = CACHED_LISTING[props.baseURL] = files;
    }
  }
  return indexFiles;
}


