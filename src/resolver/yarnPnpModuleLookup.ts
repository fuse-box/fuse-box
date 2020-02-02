import * as path from 'path';
import { INodeModuleLookup, IModuleParsed } from './nodeModuleLookup';
import { IPackageMeta, IResolverProps } from './resolver';
import { fileExists, makeFuseBoxPath } from '../utils/utils';
import { handleBrowserField } from './browserField';
import { getFolderEntryPointFromPackageJSON } from './shared';
import { fileLookup } from './fileLookup';

export function resolvePnpModule(props: IResolverProps, parsed: IModuleParsed): INodeModuleLookup {
  const pnp = require('pnpapi');
  const { createRequire } = require('module');
  const { target, name } = parsed;
  const targetRequire = createRequire(props.filePath);
  const folder = pnp.resolveToUnqualified(name, props.filePath, { considerBuiltins: false });

  const result: INodeModuleLookup = {};
  const pkg: IPackageMeta = {
    name: target,
    packageRoot: folder,
  };

  const packageJSONFile = path.join(folder, 'package.json');
  if (!fileExists(packageJSONFile)) {
    return { error: `Failed to find package.json in ${folder} when resolving module ${parsed.name}` };
  }

  const json = targetRequire(packageJSONFile);
  pkg.name = json.name;
  pkg.version = json.version || '0.0.0';
  pkg.browser = json.browser;
  pkg.packageJSONLocation = packageJSONFile;
  pkg.packageRoot = folder;
  result.meta = pkg;

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

  result.meta = pkg;
  return result;
}
