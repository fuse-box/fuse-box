import * as appRoot from 'app-root-path';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentedError } from '../logging/DocumentedError';
import { fileExists, makeFuseBoxPath } from '../utils/utils';
import { fileLookup } from './fileLookup';
import { IPackageMeta, IResolverProps } from './resolver';
import { getFolderEntryPointFromPackageJSON } from './shared';

const PROJECT_NODE_MODULES = path.join(appRoot.path, 'node_modules');

const NODE_MODULE_REGEX = /^(([a-z0-9@\-_]+)(\/)?([a-z0-0.@-_]+)?(\/)?(.*))$/;

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
    const matchedLast = last.match(/[\/|\\](\w+)/g);
    if (matchedLast && matchedLast[1]) {
      paths.push(path.join(paths[paths.length - 1], matchedLast[0], 'node_modules'));
    }
    return paths;
  } else {
    return [PROJECT_NODE_MODULES];
  }
}

export function findTargetFolder(props: IResolverProps, parsed: IModuleParsed): string {
  // handle custom modules here
  if (props.modules) {
    for (const i in props.modules) {
      const f = path.join(props.modules[i], parsed.name);
      if (fs.existsSync(f)) {
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
}
export interface INodeModuleLookup {
  targetAbsPath?: string;
  targetExtension?: string;
  targetFuseBoxPath?: string;
  isEntry?: boolean;
  forcedStatement?: string;
  meta?: IPackageMeta;
}

export function nodeModuleLookup(props: IResolverProps, parsed: IModuleParsed): INodeModuleLookup {
  const folder = findTargetFolder(props, parsed);
  const result: INodeModuleLookup = {};
  const pkg: IPackageMeta = {
    name: parsed.name,
    packageRoot: folder,
  };
  result.meta = pkg;

  if (!folder) {
    throw new DocumentedError('001', `Failed to resolved ${parsed.name}`);
  }
  const packageJSONFile = path.join(folder, 'package.json');
  if (!fileExists(packageJSONFile)) {
    throw new DocumentedError('002', `Failed to find package.json in ${folder} when resolving module ${parsed.name}`);
  }
  const json = require(packageJSONFile);
  pkg.version = json.version || '0.0.0';
  pkg.browser = json.browser;
  pkg.packageJSONLocation = packageJSONFile;
  pkg.packageRoot = folder;

  // extract entry point
  const entryFile = getFolderEntryPointFromPackageJSON(json, props.buildTarget === 'browser');

  const entryLookup = fileLookup({ target: entryFile, fileDir: folder });
  if (!entryLookup.fileExists) {
    throw new DocumentedError('002', `Failed to resolve an entry point in package ${parsed.name}`);
  }
  pkg.entryAbsPath = entryLookup.absPath;
  pkg.entryFuseBoxPath = makeFuseBoxPath(folder, entryLookup.absPath);
  // extract target if required
  if (parsed.target) {
    const parsedLookup = fileLookup({ target: parsed.target, fileDir: folder });
    if (!parsedLookup) {
      throw new DocumentedError('003', `Failed to resolve ${props.target} in ${parsed.name}`);
    }
    result.targetAbsPath = parsedLookup.absPath;

    result.isEntry = false;
    result.targetFuseBoxPath = makeFuseBoxPath(folder, parsedLookup.absPath);
    if (parsedLookup.customIndex) {
      result.forcedStatement = `${parsed.name}/${result.targetFuseBoxPath}`;
    }
  } else {
    result.isEntry = true;

    result.targetAbsPath = pkg.entryAbsPath;
    result.targetFuseBoxPath = pkg.entryFuseBoxPath;
  }
  result.targetExtension = path.extname(result.targetAbsPath);
  return result;
}
