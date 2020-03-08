import * as path from 'path';
import { findUp } from '../utils/findUp';
import { fileExists, makeFuseBoxPath, readFile } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { fileLookup } from './fileLookup';
import { IPackageMeta, IResolverProps } from './resolver';
import { realpathSync } from 'fs';

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
export function findTargetFolder(props: IResolverProps, name: string): string {
  // handle custom modules here
  if (props.modules) {
    for (const i in props.modules) {
      const f = path.join(props.modules[i], name);
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
      const folder = pnp.resolveToUnqualified(name, props.filePath, { considerBuiltins: false });
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
    const attempted = path.join(paths[i], name);
    if (fileExists(path.join(attempted, "package.json"))) {
      return realpathSync(attempted);
    }
  }

  let localModuleRoot = CACHED_LOCAL_MODULES[props.filePath];
  if (localModuleRoot === undefined) {
    localModuleRoot = CACHED_LOCAL_MODULES[props.filePath] = findUp(props.filePath, 'node_modules');
  }

  if (!!localModuleRoot && paths.indexOf(localModuleRoot) === -1) {
    const attempted = path.join(localModuleRoot, name);
    if (fileExists(path.join(attempted, "package.json"))) {
      return realpathSync(attempted);
    }
  }
}
export interface INodeModuleLookup {
  error?: string;
  // TODO: not used?
  isEntry?: boolean;
  meta?: IPackageMeta;
  targetAbsPath?: string;
  // TODO: not used?
  targetExtension?: string;
  // TODO: not used?
  targetFuseBoxPath?: string;
}

export function nodeModuleLookup(props: IResolverProps, parsed: IModuleParsed): INodeModuleLookup {
  let folder: string;
  const { name: moduleName, target } = parsed;

  // Resolve the module name to a folder
  folder = findTargetFolder(props, moduleName);
  if (!folder) {
    return { error: `Cannot resolve "${moduleName}"` };
  }

  const packageJSONFile = path.join(folder, 'package.json');
  if (!fileExists(packageJSONFile)) {
    return { error: `Failed to find package.json in ${folder} when resolving module ${moduleName}` };
  }
  const json = JSON.parse(readFile(packageJSONFile));
  // Prepare the package metadata structure and copy a bunch of stuff into it
  const pkg: IPackageMeta = {
    name: moduleName,
    packageRoot: folder,
    version: json.version || '0.0.0',
    browser: json.browser,
    packageJSONLocation: packageJSONFile,
    fusebox: json['fuse-box'] || undefined,
  };

  const isBrowser = props.buildTarget === 'browser';

  const isEntry = !target;
  const targetLookup = fileLookup({ fileDir: folder, target: target || "", isBrowserBuild: isBrowser });
  if (!targetLookup || !targetLookup.fileExists) {
    const spec = target ? `"${target}"` : "an entry point";
    return { error: `Failed to resolve ${spec} in package "${moduleName}"` };
  }
  let targetAbsPath = targetLookup.absPath;

  const checkBrowserOverride = isBrowser && json.browser && typeof json.browser === 'object'
  if (checkBrowserOverride) {
    const override = handleBrowserField(pkg, targetLookup.absPath);
    if (override) {
      targetAbsPath = override;
    }
  }

  const targetFuseBoxPath = makeFuseBoxPath(folder, targetAbsPath);

  if (isEntry) {
    pkg.entryAbsPath = targetAbsPath;
    pkg.entryFuseBoxPath = targetFuseBoxPath;
  }

  const targetExtension = path.extname(targetAbsPath);

  return {
    isEntry,
    targetAbsPath,
    targetFuseBoxPath,
    targetExtension,
    meta: pkg,
  };
}
