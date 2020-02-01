import { existsSync } from 'fs';
import * as path from 'path';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { createModule, IModule, IModuleMeta } from '../moduleResolver/module';
import { Package, PackageType, IPackage } from '../moduleResolver/package';
import { fastHash, fileExists, getFileModificationTime, readFile, removeFolder, writeFile } from '../utils/utils';
import { WatcherReaction } from '../watcher/watcher';

export interface ICachePublicProps {
  FTL?: boolean;
  enabled: boolean;
  root?: string;
}

export interface IModuleRestoreResponse {
  module?: IModule;
  mrc: IModuleResolutionContext;
}
export interface ICache {
  meta: ICacheMeta;
  nuke: () => void;
  restore: (absPath: string) => IModuleRestoreResponse;
  write: () => void;
}

export interface IModuleResolutionContext {
  modulesRequireResolution: Array<{ absPath: string; pkg: IPackage }>;
}

export interface ICacheMeta {
  ctx?: Record<string, any>;
  currentId?: number;
  modules: Record<number, IModuleMeta>;
  packages: Record<string, IPackage>;
}

function readJSONFile(target: string) {
  return JSON.parse(readFile(target));
}

const META_CACHE: Record<string, any> = {};

export function moduleMetaCache(modulesFolder: string) {
  const self = {
    read: (meta: IModuleMeta) => {
      const cachedFile = path.join(modulesFolder, meta.id + '.json');
      if (META_CACHE[cachedFile]) return META_CACHE[cachedFile];
      if (!existsSync(cachedFile)) return;
      const data = readJSONFile(cachedFile);
      META_CACHE[cachedFile] = data;
      return data;
    },
    write: (module: IModule) => {
      const cachedFile = path.join(modulesFolder, `${module.id}.json`);
      const data = { contents: module.contents, sourceMap: module.sourceMap };
      META_CACHE[cachedFile] = data;
      const contents = JSON.stringify(data);
      return writeFile(cachedFile, contents);
    },
  };
  return self;
}

export function createCache(ctx: Context, bundleContext: IBundleContext): ICache {
  const prefix = fastHash(ctx.config.entries.toString());
  let cacheRoot = path.join(ctx.config.cache.root, prefix);

  const metaFile = path.join(cacheRoot, 'meta.json');
  const modulesFolder = path.join(cacheRoot, 'files');
  const metaCache = moduleMetaCache(modulesFolder);

  let meta: ICacheMeta;

  if (existsSync(metaFile)) {
    meta = require(metaFile);

    bundleContext.currentId = meta.currentId;
  } else {
    meta = {
      modules: {},
      packages: {},
    };
  }
  const modules = meta.modules;

  const packages = meta.packages;
  const verifiedPackages: Record<string, boolean> = {};
  const verifiedModules: Record<string, boolean> = {};

  // restore context cachable
  if (meta.ctx) {
    for (const key in meta.ctx) {
      ctx[key] = meta.ctx[key];
    }
  }

  /**
   *
   * Restoring module
   * If module cache data is present we can safely restore
   * the modules. This function should be called on a verified module (mtime matches)
   * @param meta
   * @param cachedPackage
   */
  function restoreModule(meta: IModuleMeta, cachedPackage: IPackage) {
    if (!cachedPackage) return;

    const moduleCacheData = metaCache.read(meta);
    if (!moduleCacheData) return;

    const module = createModule({ absPath: meta.absPath, ctx: ctx });
    module.initFromCache(meta, moduleCacheData);

    if (bundleContext.packages[cachedPackage.publicName]) {
      module.pkg = bundleContext.packages[cachedPackage.publicName];
    } else {
      // restore package and assign it to module
      const pkg = Package();
      for (const key in cachedPackage) pkg[key] = cachedPackage[key];
      bundleContext.packages[cachedPackage.publicName] = pkg;
      module.pkg = pkg;
    }
    return module;
  }

  /**
   * FInding a module in meta
   * @param absPath
   */
  function findModuleMeta(absPath: string) {
    for (const moduleId in modules) {
      if (modules[moduleId].absPath === absPath) return modules[moduleId];
    }
  }

  /**
   * Veifying module
   * @param meta
   * @param mrc
   */
  function restoreModuleDependencies(meta: IModuleMeta, mrc: IModuleResolutionContext) {
    if (verifiedModules[meta.absPath]) return true;
    verifiedModules[meta.absPath] = true;

    const pkg = packages[meta.packageId];
    if (!pkg) return;

    if (isExternalPackage(pkg)) if (!restorePackage(pkg, mrc)) return;

    for (const dependencyId of meta.dependencies) {
      const target = modules[dependencyId];
      if (!target) return;
      if (!restoreModuleDependencies(target, mrc)) return;
    }
    return true;
  }

  function restorePackage(pkg: IPackage, mrc: IModuleResolutionContext) {
    if (verifiedPackages[pkg.publicName]) {
      return true;
    }

    verifiedPackages[pkg.publicName] = true;

    const packageJSONLocation = pkg.meta.packageJSONLocation;
    if (!fileExists(packageJSONLocation)) {
      // flush the package if package.json doesn't exist anymore
      packages[pkg.publicName] = undefined;
      return false;
    }

    // version changed or anything else. Drop the package from meta
    // but leave the files to preserved assigned IDS (required for the HMR)
    if (getFileModificationTime(packageJSONLocation) !== pkg.mtime) {
      // here we reset the cache of that entry point

      const bustedPackage = packages[pkg.publicName];
      const pkgName = bustedPackage.publicName;
      //bundleContext.packages[pkgName] = undefined;
      verifiedPackages[pkgName] = undefined;
      packages[pkgName] = undefined;
      return false;
    }

    const collection: Array<IModule> = [];
    // package is in tact pulling out all the files
    for (const moduleId of pkg.deps) {
      const meta = modules[moduleId];

      const depPackage = packages[meta.packageId];
      // a required dependency is missing
      // verifying and external package of the current package
      if (!meta) return false;
      if (!depPackage) return false;
      // meta might be missing ?!
      const target = restoreModule(meta, pkg);
      // cache might be missing?
      if (!target) return false;

      if (!restoreModuleDependencies(meta, mrc)) return;

      collection.push(target);
    }

    // finally populating the bundle context
    for (const restored of collection) {
      bundleContext.modules[restored.absPath] = restored;
    }
    return true;
  }

  function restoreModuleSafely(absPath: string, mrc: IModuleResolutionContext): IModule {
    if (verifiedModules[absPath]) return;

    verifiedModules[absPath] = true;
    const meta = findModuleMeta(absPath);

    const metaPackage = packages[meta.packageId];
    // not present in meta
    if (!meta) {
      mrc.modulesRequireResolution.push({ absPath, pkg: metaPackage });
      return;
    }

    // file was removed
    if (!fileExists(meta.absPath)) {
      // need to break dependants cache
      //return shouldResolve(absPath, metaPackage);
      for (const id in modules) {
        const x = modules[id];
        // package is no longer verified
        if (x.dependencies.includes(meta.id)) {
          verifiedModules[x.absPath] = false;
          x.mtime = -1;
          if (!restoreModuleSafely(x.absPath, mrc)) return;
        }
      }
    }

    if (getFileModificationTime(meta.absPath) !== meta.mtime) {
      // should be resolved
      bundleContext.modules[absPath] = undefined;
      mrc.modulesRequireResolution.push({ absPath, pkg: metaPackage });
      return;
    }

    for (const depId of meta.dependencies) {
      const target = modules[depId];
      const pkg = packages[target.packageId];
      if (pkg && isExternalPackage(pkg)) {
        if (!restorePackage(pkg, mrc)) {
          // package has failed
          // interrupt everything
          return;
        }
      } else restoreModuleSafely(target.absPath, mrc);
    }
    const module = restoreModule(meta, metaPackage);

    if (module) bundleContext.modules[module.absPath] = module;

    return module;
  }

  function getModuleByPath(absPath: string): IModuleRestoreResponse {
    const moduleMeta = findModuleMeta(absPath);

    const mrc: IModuleResolutionContext = {
      modulesRequireResolution: [],
    };

    const busted = { mrc };

    // if a module was not found in cache we do nothing
    if (!moduleMeta) return busted;

    const targetPackageId = moduleMeta.packageId;
    const modulePackage = packages[targetPackageId];

    if (!modulePackage) return busted;

    if (isExternalPackage(modulePackage)) {
      if (!restorePackage(modulePackage, mrc)) return busted;
    } else {
      // restore local files (check the modification time on each)
      return { module: restoreModuleSafely(absPath, mrc), mrc };
    }
  }

  function isExternalPackage(pkg: IPackage) {
    return pkg.type === PackageType.EXTERNAL_PACKAGE;
  }

  const self = {
    meta,
    nuke: () => removeFolder(cacheRoot),
    restore: (absPath: string) => getModuleByPath(absPath),
    write: async () => {
      const cacheWriters = [];
      let shouldWriteMeta = false;
      meta.currentId = bundleContext.currentId;

      for (const packageId in bundleContext.packages) {
        const pkg = bundleContext.packages[packageId];

        if (!packages[pkg.publicName]) {
          shouldWriteMeta = true;
          if (isExternalPackage(pkg)) {
            pkg.deps = [];
            pkg.mtime = getFileModificationTime(pkg.meta.packageJSONLocation);
          }
          packages[pkg.publicName] = pkg;
        }
      }

      for (const absPath in bundleContext.modules) {
        const module = bundleContext.modules[absPath];

        if (!module.isCached && !module.errored) {
          shouldWriteMeta = true;
          const meta = module.getMeta();

          modules[module.id] = meta;

          const cachedPackage = packages[module.pkg.publicName];

          if (isExternalPackage(cachedPackage)) {
            if (!cachedPackage.deps.includes(module.id)) cachedPackage.deps.push(module.id);
          }

          cacheWriters.push(metaCache.write(module));
        }
      }

      // fast and ugly check if cache context needs to be written
      const cachable = ctx.getCachable();

      if (JSON.stringify(meta.ctx) !== JSON.stringify(cachable)) {
        shouldWriteMeta = true;
        meta.ctx = cachable;
      }
      await Promise.all(cacheWriters);
      if (shouldWriteMeta) await writeFile(metaFile, JSON.stringify(meta, null, 2));
    },
  };

  const nukableReactions = [WatcherReaction.TS_CONFIG_CHANGED, WatcherReaction.FUSE_CONFIG_CHANGED];
  ctx.ict.on('watcher_reaction', ({ reactionStack }) => {
    for (const item of reactionStack) {
      if (nukableReactions.includes(item.reaction)) {
        self.nuke();
        break;
      }
    }
  });
  return self;
}
