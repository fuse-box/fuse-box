import * as appRoot from 'app-root-path';
import * as path from 'path';
import { fileExists, makeFuseBoxPath } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { fileLookup } from './fileLookup';
import { IPackageMeta, IResolverProps } from './resolver';
import { getFolderEntryPointFromPackageJSON, isBrowserEntry } from './shared';
import { findUp } from '../utils/findUp';

const PROJECT_NODE_MODULES = path.join(appRoot.path, 'node_modules');

const NODE_MODULE_REGEX = /^(([^\.][\.a-z0-9@\-_]*)(\/)?([_a-z0-9.@-]+)?(\/)?(.*))$/i;

export interface IModuleParsed {
  name: string;
  target?: string;
}

export function isNodeModule(path: string): IModuleParsed | undefined {
  const matched = path.match(NODE_MODULE_REGEX);
  if (!matched) {
    return;
  }
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

export function parseAllModulePaths(fileAbsPath: string) {
  const baseDir = path.dirname(fileAbsPath);
  const paths = [];

  const snippets = baseDir.split(/node_modules/);
  let current = '';
  if (snippets.length > 1) {
    const total = snippets.length - 1;
    for (let i = 0; i < total; i++) {
      current = path.join(current, snippets[i], 'node_modules');
      paths.push(current);
    }

    const last = snippets[total];

    const matchedLast = last.match(/[\/|\\]([a-z-@0-9_-]+)/gi);
    if (matchedLast && matchedLast[0]) {
      paths.push(path.join(paths[paths.length - 1], matchedLast[0], 'node_modules'));
    }
    return paths;
  }

  return [PROJECT_NODE_MODULES];
}

const CACHED_LOCAL_MODULES: { [key: string]: string | null } = {};
export function findTargetFolder(props: IResolverProps, parsed: IModuleParsed): string {
  // handle custom modules here
  if (props.modules) {
    for (const i in props.modules) {
      const f = path.join(props.modules[i], parsed.name);
      if (fileExists(f)) {
        return f;
      }
    }
  }

  const paths = parseAllModulePaths(props.filePath);

  for (let i = paths.length - 1; i >= 0; i--) {
    const attempted = path.join(paths[i], parsed.name);
    if (fileExists(attempted)) {
      return attempted;
    }
  }

  let localModuleRoot = CACHED_LOCAL_MODULES[props.filePath];
  if (localModuleRoot === undefined) {
    localModuleRoot = CACHED_LOCAL_MODULES[props.filePath] = findUp(props.filePath, 'node_modules');
  }

  if (!!localModuleRoot && paths.indexOf(localModuleRoot) === -1) {
    const attempted = path.join(localModuleRoot, parsed.name);
    if (fileExists(attempted)) {
      return attempted;
    }
  }
}
export interface INodeModuleLookup {
  error?: string;
  targetAbsPath?: string;
  targetExtension?: string;
  targetFuseBoxPath?: string;
  isEntry?: boolean;
  forcedStatement?: string;
  meta?: IPackageMeta;
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
  const json = require(packageJSONFile);
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
    const parsedLookup = fileLookup({ target: parsed.target, fileDir: folder });
    if (!parsedLookup) {
      return { error: `Failed to resolve ${props.target} in ${parsed.name}` };
    }

    result.targetAbsPath = parsedLookup.absPath;

    if (json.browser && typeof json.browser === 'object') {
      const override = handleBrowserField(pkg, parsedLookup.absPath);
      if (override) {
        result.targetAbsPath = override;
        parsedLookup.customIndex = true;
      }
    }

    result.isEntry = false;
    result.targetFuseBoxPath = makeFuseBoxPath(folder, result.targetAbsPath);

    if (parsedLookup.customIndex) {
      result.forcedStatement = `${parsed.name}/${result.targetFuseBoxPath}`;
    }
  } else {
    const entryFile = getFolderEntryPointFromPackageJSON({ json: json, isBrowserBuild: isBrowser });

    const entryLookup = fileLookup({ target: entryFile, fileDir: folder });

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
    if (isBrowserEntry(json, isBrowser)) {
      result.forcedStatement = `${parsed.name}/${result.targetFuseBoxPath}`;
    }

    if (json.browser && typeof json.browser === 'object') {
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
