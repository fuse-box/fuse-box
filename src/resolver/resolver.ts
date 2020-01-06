import { ITarget } from '../config/PrivateConfig';
import { makeFuseBoxPath, path2Regex } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { fileLookup, ILookupResult, TsConfigAtPath } from './fileLookup';
import { INodeModuleLookup, isNodeModule, nodeModuleLookup } from './nodeModuleLookup';
import { pathsLookup } from './pathsLookup';
import { isElectronPolyfill, isServerPolyfill } from './polyfills';
export enum ImportType {
  REQUIRE,
  FROM,
  RAW_IMPORT,
  DYNAMIC,
}

export interface ITypescriptPathsConfig {
  baseURL: string;
  paths?: { [key: string]: Array<string> };
}
export interface IResolverProps {
  buildTarget?: ITarget;
  // user string
  target: string;
  isDev?: boolean;
  cache?: boolean;
  homeDir?: string;
  filePath?: string;
  packageMeta?: IPackageMeta;
  modules?: Array<string>;
  importType?: ImportType;
  javascriptFirst?: boolean;
  alias?: {
    [key: string]: string;
  };
  typescriptPaths?: ITypescriptPathsConfig;
}

export interface IPackageMeta {
  name: string;
  fusebox?: {
    system?: boolean;
    dev?: boolean;
    polyfill?: boolean;
  };
  entryAbsPath?: string;
  entryFuseBoxPath?: string;
  version?: string;
  packageRoot?: string;
  // rare case where a package with the same version is located in multiple sub modules
  packageAltRoots?: Array<string>;
  packageJSONLocation?: string;
  // https://github.com/defunctzombie/package-browser-field-spec
  browser?: { [key: string]: string | boolean } | string;
}

export interface IResolver {
  error?: string;
  // skip bundling
  skip?: boolean;
  // external e.g. http://something.com/main.css
  isExternal?: boolean;
  // e.g ".css" ".js"
  extension?: string;

  // this is resolved one from the main project and passed later as IResolverProps.package
  package?: INodeModuleLookup;

  // resolved absolute path
  absPath?: string;
  // make sure that it's a public path. E.g "components/MyComponent.jsx"
  // tsx and ts needs to be replaced with js and jsx
  fuseBoxPath?: string;

  forcedStatement?: string;
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
      return { target, forceReplacement: true };
    }
  }
  return { target, forceReplacement };
}

export function resolveModule(props: IResolverProps): IResolver {
  const external = isExternalModule(props);
  if (external) {
    return external;
  }
  const isBrowserBuild = props.buildTarget === 'browser';
  const isServerBuild = props.buildTarget === 'server';
  const isElectronBuild = props.buildTarget === 'electron';
  const isUniversalBuild = props.buildTarget === 'universal';
  let target = props.target;

  let forcedStatement: string;
  let forceReplacement = false;

  let lookupResult: ILookupResult;

  // replace aliaes
  // props.target will be updated
  if (props.alias) {
    const res = replaceAliases(props);
    forceReplacement = res.forceReplacement;
    target = res.target;
  }

  // handle typescript paths
  // in this cases it should always send a forceStatement
  if (props.typescriptPaths) {
    lookupResult = pathsLookup({
      isDev: props.isDev,
      baseURL: props.typescriptPaths.baseURL,
      cachePaths: props.cache,
      homeDir: props.homeDir,
      paths: props.typescriptPaths.paths,
      target: target,
    });

    if (lookupResult) {
      forceReplacement = true;
    }
  }

  const browserFieldLookup =
    props.packageMeta && isBrowserBuild && props.packageMeta.browser && typeof props.packageMeta.browser === 'object';
  // continue looking for the file
  if (!lookupResult) {
    let moduleParsed = isNodeModule(target);
    if (moduleParsed) {
      // first check if we need to bundle it at all;
      if (!isUniversalBuild && isServerBuild && isServerPolyfill(moduleParsed.name)) {
        return { skip: true };
      }
      if (!isUniversalBuild && isElectronBuild && isElectronPolyfill(moduleParsed.name)) {
        return { skip: true };
      }
      if (browserFieldLookup) {
        if (props.packageMeta.browser[moduleParsed.name] === false) {
          forcedStatement = 'fuse-empty-package';
          moduleParsed = { name: forcedStatement };
          forceReplacement = true;
        }
      }
      const pkg = nodeModuleLookup(props, moduleParsed);

      if (pkg.error) {
        return { error: pkg.error };
      }
      const aliasForced = forceReplacement && target;
      return {
        forcedStatement: forcedStatement ? forcedStatement : pkg.forcedStatement ? pkg.forcedStatement : aliasForced,
        package: pkg,
      };
    } else {
      lookupResult = fileLookup({
        isDev: props.isDev,
        filePath: props.filePath,
        target: target,
        javascriptFirst: props.javascriptFirst,
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
        forceReplacement = true;
        lookupResult.absPath = override;
      }
    }
  }

  if (lookupResult.customIndex) {
    forceReplacement = true;
  }
  if (props.importType && props.importType === ImportType.DYNAMIC) {
    forceReplacement = true;
  }

  const extension = lookupResult.extension;
  const absPath = lookupResult.absPath;

  let fuseBoxPath: string;
  if (props.packageMeta) {
    if (props.packageMeta.packageAltRoots) {
      if (absPath.includes(props.packageMeta.packageRoot)) {
        fuseBoxPath = makeFuseBoxPath(props.packageMeta.packageRoot, absPath);
      } else {
        for (const root of props.packageMeta.packageAltRoots) {
          if (absPath.includes(root)) {
            fuseBoxPath = makeFuseBoxPath(root, absPath);
            break;
          }
        }
      }
    } else {
      fuseBoxPath = makeFuseBoxPath(props.packageMeta.packageRoot, absPath);
    }
  } else {
    fuseBoxPath = makeFuseBoxPath(props.homeDir, absPath);
  }

  if (forceReplacement) {
    if (props.packageMeta) {
      forcedStatement = `${props.packageMeta.name}/${fuseBoxPath}`;
    } else {
      forcedStatement = `~/${fuseBoxPath}`;
    }
  }
  lookupResult.tsConfigAtPath;
  return {
    tsConfigAtPath: lookupResult.tsConfigAtPath,
    monorepoModulesPath: lookupResult.monorepoModulesPaths,
    extension,
    absPath,
    fuseBoxPath,
    forcedStatement,
  };
}
