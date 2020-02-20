import * as fs from 'fs';
import { env } from '../env';
import { WatchablePathCache } from '../watcher/bindWatcherReactions';
import { fileLookup, ILookupResult } from './fileLookup';

export type ITypescriptPaths = { [key: string]: Array<string> };
interface IPathsLookupProps {
  baseURL: string;
  cachePaths?: boolean;
  configLocation?: string;
  isDev?: boolean;
  paths?: ITypescriptPaths;
  target: string;
}

type DirectoryListing = Array<{ nameWithoutExtension: string; name: string }>;
type TypescriptPaths = Array<(target: string) => Array<string>>;

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

const localPathsData: Record<string, any> = {};
function getPathsData(props: IPathsLookupProps): TypescriptPaths {
  const location = props.configLocation;
  if (props.cachePaths && localPathsData[location]) return localPathsData[location];
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
  if (props.cachePaths) localPathsData[location] = fns;

  return fns;
}

/**
 * Listing homeDir directories to simplify matching and makae it easier for the matcher
 *
 * @param {IPathsLookupProps} props
 * @returns {(DirectoryListing | undefined)}
 */
function getIndexFiles(props: IPathsLookupProps): undefined | DirectoryListing {
  if (!props.baseURL) return [];
  const location = props.baseURL;
  if (props.cachePaths && WatchablePathCache[location] && WatchablePathCache[location].indexFiles) {
    return WatchablePathCache[location].indexFiles;
  }

  let indexFiles: Array<{ nameWithoutExtension: string; name: string }> = [];
  const listed = fs.readdirSync(location);
  for (const file of listed) {
    if (file[0] !== '.') {
      const [nameWithoutExtension] = file.split('.');
      indexFiles.push({
        name: file,
        nameWithoutExtension,
      });
    }
  }
  if (props.cachePaths) {
    if (!WatchablePathCache[location]) WatchablePathCache[location] = {};
    WatchablePathCache[location].indexFiles = indexFiles;
  }

  return indexFiles;
}

export function pathsLookup(props: IPathsLookupProps): ILookupResult {
  props.configLocation = props.configLocation ? props.configLocation : env.SCRIPT_FILE;
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
        const result = fileLookup({ fileDir: props.baseURL, isDev: props.isDev, target: directory });
        if (result && result.fileExists) {
          return result;
        }
      }
    }
  }
}
