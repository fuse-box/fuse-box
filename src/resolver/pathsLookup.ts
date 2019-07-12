import * as fs from 'fs';
import { fileLookup, ILookupResult } from './fileLookup';

export type ITypescriptPaths = { [key: string]: Array<string> };
interface IPathsLookupProps {
  homeDir: string;
  baseURL: string;
  cachePaths?: boolean;
  paths?: ITypescriptPaths;
  target: string;
}

type DirectoryListing = Array<{ nameWithoutExtension: string; name: string }>;
type TypescriptPaths = Array<(target: string) => Array<string>>;
const CACHED_LISTING: { [key: string]: DirectoryListing } = {};
const CACHED_PATHS: { [key: string]: TypescriptPaths } = {};

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
 * Listing homeDir directories to simplify matching and makae it easier for the matcher
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
        if (file[0] !== '.') {
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

export function pathsLookup(props: IPathsLookupProps): ILookupResult {
  // if baseDir is the same as homeDir we can assume aliasing directories
  // and files without the need in specifying "paths"
  // so we check if first
  const indexFiles = getIndexFiles(props);
  if (indexFiles) {
    for (const i in indexFiles) {
      const item = indexFiles[i];

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
  for (const i in items) {
    const test = items[i];
    const directories = test(props.target);
    if (directories) {
      for (const j in directories) {
        const directory = directories[j];
        const result = fileLookup({ fileDir: props.baseURL, target: directory });
        if (result && result.fileExists) {
          return result;
        }
      }
    }
  }
}
