import * as path from 'path';
import { ImportType } from '../compiler/interfaces/ImportType';
import { ITarget } from '../config/ITarget';
import { path2Regex } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { NODE_BUILTIN_MODULES } from './built-inModules';
import { TargetResolver, TsConfigAtPath, fileLookup, ILookupResult } from './fileLookup';
import { isNodeModule, nodeModuleLookup, INodeModuleLookup } from './nodeModuleLookup';
import { pathsLookup } from './pathsLookup';

export interface ITypescriptPathsConfig {
  baseURL: string;
  tsconfigPath?: string;
  paths?: { [key: string]: Array<string> };
}
export interface IResolverProps {
  buildTarget?: ITarget;
  cachePaths?: boolean;
  electronNodeIntegration?: boolean;
  filePath?: string;
  importType?: ImportType;
  isDev?: boolean;
  javascriptFirst?: boolean;
  modules?: Array<string>;
  packageMeta?: IPackageMeta;
  // user string
  target: string;
  tsTargetResolver?: TargetResolver;
  typescriptPaths?: ITypescriptPathsConfig;
  alias?: {
    [key: string]: string;
  };
}

export interface IPackageMeta {
  // https://github.com/defunctzombie/package-browser-field-spec
  browser?: string | { [key: string]: string | boolean };
  entryAbsPath?: string;
  entryFuseBoxPath?: string;
  name: string;
  // rare case where a package with the same version is located in multiple sub modules
  packageAltRoots?: Array<string>;
  packageJSONLocation?: string;
  packageRoot?: string;
  version?: string;
  fusebox?: {
    dev?: boolean;
    polyfill?: boolean;
    system?: boolean;
  };
}

export interface IResolver {
  error?: string;
  // e.g ".css" ".js"
  extension?: string;
  // external e.g. http://something.com/main.css
  isExternal?: boolean;
  // skip bundling
  skip?: boolean;

  // this is resolved one from the main project and passed later as IResolverProps.package
  package?: INodeModuleLookup;

  // resolved absolute path
  absPath?: string;
  // a resolver might return an additional path where to look for modules
  monorepoModulesPath?: string;

  tsConfigAtPath?: TsConfigAtPath;
}

function isExternalModule(props: IResolverProps): IResolver {
  if (/^https?:/.test(props.target)) {
    return {
      isExternal: true,
    };
  }
}

function replaceAliases(
  props: IResolverProps,
): {
  forceReplacement: boolean;
  target: string;
} {
  let forceReplacement = false;
  let target = props.target;
  for (const key in props.alias) {
    const regex = path2Regex(key);
    const value = props.alias[key];
    if (regex.test(target)) {
      target = target.replace(regex, value);
      return { forceReplacement: true, target };
    }
  }
  return { forceReplacement, target };
}

export function resolveModule(props: IResolverProps): IResolver {
  if (path.isAbsolute(props.target))
    return {
      absPath: props.target,
    };

  const external = isExternalModule(props);
  if (external) {
    return external;
  }
  const isBrowserBuild = props.buildTarget === 'browser';
  const isServerBuild = props.buildTarget === 'server';
  const isElectronBuild = props.buildTarget === 'electron';

  let target = props.target;

  let lookupResult: ILookupResult;

  // replace aliaes
  // props.target will be updated
  if (props.alias) {
    const res = replaceAliases(props);
    target = res.target;
  }

  // handle typescript paths
  // in this cases it should always send a forceStatement
  if (props.typescriptPaths) {
    lookupResult = pathsLookup({
      baseURL: props.typescriptPaths.baseURL,
      cachePaths: props.cachePaths,
      configLocation: props.typescriptPaths.tsconfigPath,
      isDev: props.isDev,
      paths: props.typescriptPaths.paths,
      target: target,
    });
  }

  const browserFieldLookup =
    props.packageMeta && isBrowserBuild && props.packageMeta.browser && typeof props.packageMeta.browser === 'object';
  // continue looking for the file
  if (!lookupResult) {
    let moduleParsed = target && isNodeModule(target);
    if (moduleParsed) {
      // first check if we need to bundle it at all;
      if (
        (isServerBuild || (isElectronBuild && props.electronNodeIntegration)) &&
        NODE_BUILTIN_MODULES.includes(moduleParsed.name)
      ) {
        return { skip: true };
      }

      if (browserFieldLookup) {
        if (props.packageMeta.browser[moduleParsed.name] === false) {
          moduleParsed = { name: 'fuse-empty-package' };
        }
      }
      const pkg = nodeModuleLookup(props, moduleParsed);

      if ('error' in pkg) {
        return pkg;
      }

      return {
        package: pkg,
      };
    } else {
      lookupResult = fileLookup({
        filePath: props.filePath,
        isDev: props.isDev,
        javascriptFirst: props.javascriptFirst,
        target: target,
      });
    }
  }

  if (!lookupResult.fileExists) {
    return;
  }

  if (props.packageMeta) {
    if (isBrowserBuild && props.packageMeta.browser && typeof props.packageMeta.browser === 'object') {
      // a match should direct according to the specs
      const override = handleBrowserField(props.packageMeta, lookupResult.absPath);
      if (override) {
        lookupResult.absPath = override;
      }
    }
  }

  const extension = lookupResult.extension;
  const absPath = lookupResult.absPath;

  return {
    absPath,
    extension,
    monorepoModulesPath: lookupResult.monorepoModulesPaths,
    tsConfigAtPath: lookupResult.tsConfigAtPath,
  };
}
