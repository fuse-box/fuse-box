import { existsSync, statSync } from 'fs';
import * as path from 'path';
import { Context } from '../core/Context';
import { IBundleContext } from '../moduleResolver/BundleContext';
import { createModule, IModule, IModuleMeta } from '../moduleResolver/Module';
// import { Package, createPackage, IPackage } from '../moduleResolver/Package';
import { Package, IPackage } from '../moduleResolver/Package';
import { ensureDir, writeFile } from '../utils/utils';

export interface ICachePublicProps {
  FTL?: boolean;
  enabled: boolean;
  root?: string;
}
export interface ICache {
  restore: (absPath: string) => { module: IModule; mrc: IModuleResolutionContext };
  write: () => void;
}

export interface IModuleResolutionContext {
  modulesCached: Array<IModule>;
  modulesRequireResolution: Array<{ id: number; absPath: string; pkg?: IPackage }>;
  processed: Record<number, number>;
}

export interface ICacheMeta {
  currentId?: number;
  modules: Record<number, IModuleMeta>;
  packages: Record<string, IPackage>;
}

export function getMTime(absPath): number {
  return statSync(absPath).mtime.getTime();
}

export function createCache(ctx: Context, bundleContext: IBundleContext): ICache {
  let cacheRoot = ctx.config.cache.root;

  const metaFile = path.join(cacheRoot, 'meta.json');
  const modulesFolder = path.join(cacheRoot, 'files');
  ensureDir(modulesFolder);

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

  function flushRecord(absPath: string, id: number, mrc: IModuleResolutionContext) {
    const cachedModule = meta.modules[id];

    let pkg: IPackage;
    if (cachedModule) {
      pkg = meta.packages[cachedModule.packageId];
      delete meta.modules[id];
    }

    mrc.modulesRequireResolution.push({ absPath, id, pkg });
  }

  function verifyRecord(id: number, mrc: IModuleResolutionContext): IModule {
    // avoid circular dependency issues
    if (mrc.processed[id] === 1) return;
    mrc.processed[id] = 1;

    const record = meta.modules[id];
    let target: IModule;
    if (existsSync(record.absPath) && getMTime(record.absPath) === record.mtime) {
      const cacheFile = path.join(modulesFolder, record.id + '.json');
      if (existsSync(cacheFile)) {
        const moduleCacheData = require(cacheFile);
        const module = (target = createModule({ absPath: record.absPath, ctx: ctx }));
        module.initFromCache(record, moduleCacheData);

        const cachedPackage = meta.packages[record.packageId];
        if (cachedPackage) {
          // restore directly from the bundle context
          if (bundleContext.packages[cachedPackage.publicName]) {
            module.pkg = bundleContext.packages[cachedPackage.publicName];
          } else {
            // restore package and assign it to module
            const pkg = Package();
            for (const key in cachedPackage) pkg[key] = cachedPackage[key];
            bundleContext.packages[cachedPackage.publicName] = pkg;
            module.pkg = pkg;
          }
        }

        mrc.modulesCached.push(module);
        if (record.dependencies) {
          for (const rid of record.dependencies) {
            verifyRecord(rid, mrc);
          }
        }
      } else flushRecord(record.absPath, id, mrc);
    } else flushRecord(record.absPath, id, mrc);
    return target;
  }

  function verityAbsPath(absPath: string, mrc: IModuleResolutionContext): IModule {
    let recordId;
    for (const id in meta.modules) {
      const record = meta.modules[id];

      if (record && record.absPath === absPath) {
        recordId = id;
        break;
      }
    }
    if (recordId) return verifyRecord(recordId, mrc);
  }

  return {
    restore: (absPath: string) => {
      const mrc: IModuleResolutionContext = {
        modulesCached: [],
        modulesRequireResolution: [],
        processed: {},
      };

      return { module: verityAbsPath(absPath, mrc), mrc };
    },

    write: async () => {
      const cacheWriters = [];
      let shouldWriteMeta = false;
      meta.currentId = bundleContext.currentId;

      for (const packageId in bundleContext.packages) {
        const pkg = bundleContext.packages[packageId];

        if (!meta.packages[pkg.publicName]) {
          shouldWriteMeta = true;
          meta.packages[pkg.publicName] = pkg;
        }
      }

      for (const absPath in bundleContext.modules) {
        const module = bundleContext.modules[absPath];

        if (!module.isCached && !module.errored) {
          shouldWriteMeta = true;
          meta.modules[module.id] = module.getMeta();
          const cacheFile = path.join(modulesFolder, `${module.id}.json`);
          const contents = JSON.stringify({ contents: module.contents, sourceMap: module.sourceMap });
          cacheWriters.push(writeFile(cacheFile, contents));
        }
      }

      await Promise.all(cacheWriters);

      if (shouldWriteMeta) await writeFile(metaFile, JSON.stringify(meta, null, 2));
    },
  };
}
