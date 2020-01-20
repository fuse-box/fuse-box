import { existsSync, statSync } from 'fs';
import * as path from 'path';
import { Context } from '../core/Context';
import { IBundleContext } from '../ModuleResolver/BundleContext';
import { IModule, IModuleMeta, createModule } from '../ModuleResolver/Module';
import { ensureDir, writeFile } from '../utils/utils';
export interface ICachePublicProps {
  enabled: boolean;
  FTL?: boolean;
  root?: string;
}
export interface ICache {
  write: () => void;
  restore: (absPath: string) => { module: IModule; mrc: IModuleResolutionContext };
}

export interface IModuleResolutionContext {
  processed: Record<number, number>;
  modulesRequireResolution: Array<{ id: number; absPath: string }>;
  modulesCached: Array<IModule>;
}
export interface ICacheMeta {
  currentId: number;
  modules: Record<number, IModuleMeta>;
}

function getMTime(absPath) {
  return statSync(absPath).mtime.toString();
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
      currentId: bundleContext.currentId,
      modules: [],
    };
  }

  function flushRecord(absPath: string, id: number, mrc: IModuleResolutionContext) {
    if (meta.modules[id]) delete meta.modules[id];
    mrc.modulesRequireResolution.push({ id, absPath });
  }

  function verifyRecord(id: number, mrc: IModuleResolutionContext): IModule {
    // avoid circular dependency issues
    if (mrc.processed[id] === 1) return;
    mrc.processed[id] = 1;

    const record = meta.modules[id];
    let target: IModule;
    if (getMTime(record.absPath) === record.mtime) {
      const cacheFile = path.join(modulesFolder, record.id + '.json');
      if (existsSync(cacheFile)) {
        const moduleCacheData = require(cacheFile);
        const module = (target = createModule({ absPath: record.absPath, ctx: ctx }));
        module.initFromCache(record, moduleCacheData);
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
  //console.log(meta.modules);

  return {
    restore: (absPath: string) => {
      const mrc: IModuleResolutionContext = {
        processed: {},
        modulesRequireResolution: [],
        modulesCached: [],
      };

      return { module: verityAbsPath(absPath, mrc), mrc };
    },
    write: async () => {
      const cacheWriters = [];
      for (const absPath in bundleContext.modules) {
        const module = bundleContext.modules[absPath];
        if (!module.isCached) {
          meta.modules[module.id] = module.getMeta();
          const cacheFile = path.join(modulesFolder, `${module.id}.json`);
          const contents = JSON.stringify({ contents: module.contents, sourceMap: module.sourceMap });
          cacheWriters.push(writeFile(cacheFile, contents));
        }
      }
      await Promise.all(cacheWriters);
      await writeFile(metaFile, JSON.stringify(meta, null, 2));
    },
  };
}
