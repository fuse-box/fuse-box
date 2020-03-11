import * as path from 'path';
import { findUp } from '../utils/findUp';
import { fileExists, makeFuseBoxPath, readFile } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { fileLookup } from './fileLookup';
import { IPackageMeta, IResolverProps } from './resolver';
import { realpathSync } from 'fs';
import { getFolderEntryPointFromPackageJSON } from './shared';

const NODE_MODULE_REGEX = /^(([^\.][\.a-z0-9@\-_]*)(\/)?([_a-z0-9.@-]+)?(\/)?(.*))$/i;

export interface IModuleParsed {
  name: string;
  target?: string;
}

export function isNodeModule(path: string): undefined | IModuleParsed {
  const matched = path.match(NODE_MODULE_REGEX);
  if (!matched) return;

  let [name, b, c] = [matched[2], matched[4], matched[6]];

  const result: IModuleParsed = { name };
  if (name[0] === '@') {
    result.name = name + '/' + b;
    if (c) {
      result.target = c;
    }
  } else {
    if (b) {
      result.target = c ? b + '/' + c : b;
    }
  }
  return result;
}

function parentDir(normalizedPath: string): string | undefined {
  const parent = path.dirname(normalizedPath);
  if (parent === normalizedPath)
    return undefined;
  return parent;
}

export function parseAllModulePaths(fileAbsPath: string): string[] {
  const start = path.normalize(fileAbsPath);
  const paths = [];
  for (let dir = parentDir(start); dir !== undefined; dir = parentDir(dir)) {
    const name = path.basename(dir);
    if (name === "node_modules")
      continue;
    paths.unshift(path.join(dir, "node_modules"));
  }

  return paths;
}

const pathExists = new Map<string, boolean>();
function memoizedExists(absPath: string): boolean {
  let exists = pathExists.get(absPath);
  if (exists === undefined) {
    exists = fileExists(absPath);
    pathExists.set(absPath, exists);
  }
  return exists;
}

export function parseExistingModulePaths(fileAbsPath: string): string[] {
  const all = parseAllModulePaths(fileAbsPath);
  const existing = [];
  for (let i = 0; i < all.length; i++) {
    memoizedExists(all[i]) && existing.push(all[i]);
  }
  return existing;
}

const CACHED_LOCAL_MODULES: { [key: string]: string | null } = {};
export function findTargetFolder(props: IResolverProps, parsed: IModuleParsed): string {
  // handle custom modules here
  if (props.modules) {
    for (const i in props.modules) {
      const f = path.join(props.modules[i], parsed.name);
      if (fileExists(f)) {
        return realpathSync(f);
      }
    }
  }

  const isPnp = (process.versions as any).pnp;

  // Support for Yarn v2 PnP
  if (isPnp) {
    try {
      const pnp = require('pnpapi');
      const folder = pnp.resolveToUnqualified(parsed.name, props.filePath, { considerBuiltins: false });
      return folder;
    } catch (e) {
      // Ignore error here, since it will be handled later
      // Don't ignore these errors, because PnP returns very useful errors and
      console.error(e);
    }
    // If this is PnP and PnP says it doesn't exist,
    // don't continue trying the rest of the node_modules stuff
    return;
  }

  const paths = parseExistingModulePaths(props.filePath);

  for (let i = paths.length - 1; i >= 0; i--) {
    const attempted = path.join(paths[i], parsed.name);
    if (fileExists(path.join(attempted, "package.json"))) {
      return realpathSync(attempted);
    }
  }

  let localModuleRoot = CACHED_LOCAL_MODULES[props.filePath];
  if (localModuleRoot === undefined) {
    localModuleRoot = CACHED_LOCAL_MODULES[props.filePath] = findUp(props.filePath, 'node_modules');
  }

  if (!!localModuleRoot && paths.indexOf(localModuleRoot) === -1) {
    const attempted = path.join(localModuleRoot, parsed.name);
    if (fileExists(path.join(attempted, "package.json"))) {
      return realpathSync(attempted);
    }
  }
}
export interface INodeModuleLookup {
  error?: string;
  isEntry?: boolean;
  meta?: IPackageMeta;
  targetAbsPath?: string;
  targetExtension?: string;
  targetFuseBoxPath?: string;
}

export function nodeModuleLookup(props: IResolverProps, parsed: IModuleParsed): INodeModuleLookup {
  let folder: string;

  folder = findTargetFolder(props, parsed);
  if (!folder) {
    return { error: `Cannot resolve "${parsed.name}"` };
  }

  const result: INodeModuleLookup = {};
  const pkg: IPackageMeta = {
    name: parsed.name,
    packageRoot: folder,
  };
  result.meta = pkg;

  const packageJSONFile = path.join(folder, 'package.json');
  if (!fileExists(packageJSONFile)) {
    return { error: `Failed to find package.json in ${folder} when resolving module ${parsed.name}` };
  }
  const json = JSON.parse(readFile(packageJSONFile));
  pkg.version = json.version || '0.0.0';
  pkg.browser = json.browser;
  pkg.packageJSONLocation = packageJSONFile;
  pkg.packageRoot = folder;
  if (json['fuse-box']) {
    pkg.fusebox = json['fuse-box'];
  }

  const isBrowser = props.buildTarget === 'browser';
  // extract entry point

  // extract target if required
  if (parsed.target) {
    const parsedLookup = fileLookup({ fileDir: folder, target: parsed.target });
    if (!parsedLookup) {
      return { error: `Failed to resolve ${props.target} in ${parsed.name}` };
    }

    result.targetAbsPath = parsedLookup.absPath;

    if (isBrowser && json.browser && typeof json.browser === 'object') {
      const override = handleBrowserField(pkg, parsedLookup.absPath);
      if (override) {
        result.targetAbsPath = override;
        parsedLookup.customIndex = true;
      }
    }

    result.isEntry = false;
    result.targetFuseBoxPath = makeFuseBoxPath(folder, result.targetAbsPath);
  } else {
    const entryFile = getFolderEntryPointFromPackageJSON({ isBrowserBuild: isBrowser, json: json });

    const entryLookup = fileLookup({ fileDir: folder, target: entryFile });

    if (!entryLookup.fileExists) {
      return {
        error: `Failed to resolve an entry point in package ${parsed.name}. File ${entryFile} cannot be resolved.`,
      };
    }

    pkg.entryAbsPath = entryLookup.absPath;
    pkg.entryFuseBoxPath = makeFuseBoxPath(folder, entryLookup.absPath);

    result.isEntry = true;

    result.targetAbsPath = pkg.entryAbsPath;
    result.targetFuseBoxPath = pkg.entryFuseBoxPath;

    if (isBrowser && json.browser && typeof json.browser === 'object') {
      const override = handleBrowserField(pkg, entryLookup.absPath);
      if (override) {
        //result.targetFuseBoxPath =
        result.targetAbsPath = override;
        pkg.entryAbsPath = override;
        result.targetFuseBoxPath = makeFuseBoxPath(folder, override);
        pkg.entryFuseBoxPath = result.targetFuseBoxPath;

        entryLookup.customIndex = true;
      }
    }
  }
  result.targetExtension = path.extname(result.targetAbsPath);

  return result;
}
