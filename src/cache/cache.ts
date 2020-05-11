import { existsSync } from 'fs';
import * as path from 'path';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { createModule, IModule, IModuleMeta } from '../moduleResolver/module';
import { createPackageFromCache, IPackage } from '../moduleResolver/package';
import { fastHash, fileExists, getFileModificationTime, readJSONFile, removeFolder, writeFile } from '../utils/utils';
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

const META_MODULES_CACHE: Record<string, any> = {};
const META_JSON_CACHE: Record<string, ICacheMeta> = {};

export function createCache(ctx: Context, bundleContext: IBundleContext): ICache {
  const prefix = fastHash(ctx.config.entries.toString());

  const CACHE_ROOT = path.join(ctx.config.cache.root, prefix);

  const isFileStrategy = ctx.config.cache.strategy === 'fs';
  const META_FILE = path.join(CACHE_ROOT, 'meta.json');
  const CACHE_MODULES_FOLDER = path.join(CACHE_ROOT, 'files');

  function moduleMetaCache() {
    const moduleWriters = [];
    const self = {
      getMeta: () => {
        let meta: ICacheMeta;
        if (META_JSON_CACHE[META_FILE]) meta = META_JSON_CACHE[META_FILE];
        else if (isFileStrategy && existsSync(META_FILE)) {
          try {
            meta = readJSONFile(META_FILE);
          } catch (e) {}
        }
        if (!meta) {
          META_JSON_CACHE[META_FILE] = meta = { currentId: 0, modules: {}, packages: {} };
        }
        bundleContext.currentId = meta.currentId;
        return meta;
      },
      persist: async (metaChanged: boolean, meta) => {
        await Promise.all(moduleWriters);
        if (isFileStrategy && metaChanged) {
          await writeFile(META_FILE, JSON.stringify(meta, null, 2));
        }
      },
      read: (meta: IModuleMeta) => {
        const cachedFile = path.join(CACHE_MODULES_FOLDER, meta.id + '.json');
        if (META_MODULES_CACHE[cachedFile]) return META_MODULES_CACHE[cachedFile];
        if (!isFileStrategy) return;

        if (!existsSync(cachedFile)) return;
        const data = readJSONFile(cachedFile);
        META_MODULES_CACHE[cachedFile] = data;
        return data;
      },
      write: (module: IModule) => {
        const cachedFile = path.join(CACHE_MODULES_FOLDER, `${module.id}.json`);
        const data = { contents: module.contents, sourceMap: module.sourceMap };
        META_MODULES_CACHE[cachedFile] = data;

        if (!isFileStrategy) return;
        const contents = JSON.stringify(data);
        moduleWriters.push(writeFile(cachedFile, contents));
      },
    };
    return self;
  }

  const metaCache = moduleMetaCache();
  const meta = metaCache.getMeta();

  const modules = meta.modules;
  const packages = meta.packages;
  const verifiedPackages: Record<string, boolean> = {};
  const verifiedModules: Record<string, boolean> = {};

  // restore context cachable
  if (meta.ctx) {
    for (const key in meta.ctx) ctx[key] = meta.ctx[key];
  }

  function verifyLinkedReferences() {
    for (const absPath in ctx.linkedReferences) {
      const item = ctx.linkedReferences[absPath];
      if (!fileExists(absPath)) {
        // cleaning up
        ctx.linkedReferences[absPath] = undefined;
      } else {
        const mtime = getFileModificationTime(absPath);
        if (mtime !== item.mtime) {
          // the referenced file was modified, so
          // force all modules that depend on this file to be detected as modified
          for (const depId of item.deps) {
            if (modules[depId]) modules[depId].mtime = -1;
          }

          // our work here is done until the next time it is modified
          item.mtime = mtime;
        }
      }
    }
  }
  // first thing we need to verify linked referneces
  // if dependant files have changed we need to break cache on targeted modules
  verifyLinkedReferences();

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
      const pkg = createPackageFromCache(cachedPackage);
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

    if (pkg.meta) if (!restorePackage(pkg, mrc)) return;

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
      if (meta.mtime === -1) return false;

      const depPackage = packages[meta.packageId];
      // a required dependency is missing
      // verifying and external package of the current package
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
    if (verifiedModules[absPath]) return bundleContext.modules[absPath];

    verifiedModules[absPath] = true;
    const meta = findModuleMeta(absPath);

    const metaPackage = packages[meta.packageId];

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

    // check if that module depends on some other dependencies that need to be consistent
    let shouldBreakCachedModule = getFileModificationTime(meta.absPath) !== meta.mtime;
    if (meta.v) {
      for (const id of meta.v) {
        const target = modules[id];
        const restored = restoreModuleSafely(target.absPath, mrc);

        if (!target || !restored) {
          shouldBreakCachedModule = true;
          break;
        }
      }
    }

    // if any of our dependencies relied on the "main" field of a package.json
    // and that package.json has changed,
    // then the absPath of that dependency is possibly no longer valid and so we have to re-resolve everything
    for (const depId of meta.dependencies) {
      const target = modules[depId];
      const pkg = target && packages[target.packageId];
      if (
        pkg &&
        !pkg.isExternalPackage &&
        pkg.mtime &&
        pkg.meta &&
        pkg.meta.packageJSONLocation &&
        pkg.mtime !== getFileModificationTime(pkg.meta.packageJSONLocation)
      ) {
        shouldBreakCachedModule = true;
        break;
      }
    }

    if (shouldBreakCachedModule) {
      // should be resolved
      bundleContext.modules[absPath] = undefined;
      mrc.modulesRequireResolution.push({ absPath, pkg: metaPackage });
      return;
    }

    for (const depId of meta.dependencies) {
      const target = modules[depId];
      if (!target) return;
      const pkg = packages[target.packageId];
      if (pkg && pkg.isExternalPackage) {
        if (!restorePackage(pkg, mrc)) {
          // package has failed
          // interrupt everything
          mrc.modulesRequireResolution.push({ absPath, pkg: metaPackage });
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

    if (modulePackage.isExternalPackage) {
      if (!restorePackage(modulePackage, mrc)) return busted;
    } else {
      // restore local files (check the modification time on each)
      return { module: restoreModuleSafely(absPath, mrc), mrc };
    }
  }

  async function write() {
    let shouldWriteMeta = false;
    meta.currentId = bundleContext.currentId;

    for (const packageId in bundleContext.packages) {
      const pkg = bundleContext.packages[packageId];
      if (!packages[pkg.publicName]) {
        shouldWriteMeta = true;
        if (pkg.meta) {
          pkg.deps = [];
          pkg.mtime = getFileModificationTime(pkg.meta.packageJSONLocation);
        }
        packages[pkg.publicName] = pkg;
      }
    }

    const breakingCacheIds = [];
    for (const absPath in bundleContext.modules) {
      const module = bundleContext.modules[absPath];

      if (!module.isCached && !module.errored) {
        shouldWriteMeta = true;
        const fileMeta = module.getMeta();
        modules[module.id] = fileMeta;
        const pkg = packages[module.pkg.publicName];
        if (pkg.meta) if (!pkg.deps.includes(module.id)) pkg.deps.push(module.id);
        if (module.breakDependantsCache) {
          breakingCacheIds.push(module.id);
        }
        metaCache.write(module);
      }
    }

    for (const breakId of breakingCacheIds) {
      for (const id in meta.modules) {
        const target = meta.modules[id];
        if (target.dependencies.includes(breakId)) {
          if (!target.v) target.v = [];
          target.v.push(breakId);
          modules[id] = target;
        }
      }
    }

    // fast and ugly check if cache context needs to be written
    const cachable = ctx.getCachable();

    if (isFileStrategy) {
      if (JSON.stringify(meta.ctx) !== JSON.stringify(cachable)) {
        shouldWriteMeta = true;
        meta.ctx = cachable;
      }
    } else meta.ctx = cachable;
    if (!isFileStrategy) shouldWriteMeta = false;

    await metaCache.persist(shouldWriteMeta, meta);
  }

  const self = {
    meta,
    write,
    nuke: () => removeFolder(CACHE_ROOT),
    restore: (absPath: string) => getModuleByPath(absPath),
  };

  if (isFileStrategy) {
    // destroying the cache folder only in case of a file staregy
    // memory strategy should not be affected since the process is closed
    const nukableReactions = [WatcherReaction.TS_CONFIG_CHANGED, WatcherReaction.FUSE_CONFIG_CHANGED];
    ctx.ict.on('watcher_reaction', ({ reactionStack }) => {
      for (const item of reactionStack) {
        if (nukableReactions.includes(item.reaction)) {
          self.nuke();
          break;
        }
      }
    });
  }

  return self;
}
