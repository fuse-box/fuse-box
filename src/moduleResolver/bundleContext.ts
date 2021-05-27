import { createCache, createModuleIdCache, ICache } from '../cache/cache';
import { Context } from '../core/context';
import { IPackageMeta } from '../resolver/resolver';
import { IModule } from './module';
import { IPackage } from './package';

export type IBundleContext = ReturnType<typeof createBundleContext>;
export function createBundleContext(ctx: Context) {
  let currentId = 0;

  const injectedDependencies: Record<string, IModule> = {};
  const modules: Record<string, IModule> = {};
  const packages: Record<string, IPackage> = {};

  let cache: ICache;
  let moduleIdCacheWhenCacheDisabled: ICache;
  const scope = {
    cache,
    moduleIdCacheWhenCacheDisabled,
    currentId,
    injectedDependencies,
    modules,
    packages,
    getIdFor: (absPath: string) => {
      if (scope.cache) {
        const meta = scope.cache.meta;
        for (const id in meta.modules) {
          if (meta.modules[id].absPath === absPath) return meta.modules[id].id;
        }
      } else if (scope.moduleIdCacheWhenCacheDisabled) {
        const meta = scope.moduleIdCacheWhenCacheDisabled.meta;
        for (const id in meta.modules) {
          if (meta.modules[id].absPath === absPath) return parseInt(id);
        }
      }
      return ++scope.currentId;
    },
    getModule: (absPath: string) => {
      return modules[absPath];
    },
    getPackage: (meta: IPackageMeta): IPackage => {
      const name = meta ? meta.name + '@' + meta.version : 'default';
      return packages[name];
    },
    setModule: (module: IModule) => {
      modules[module.absPath] = module;
    },
    setPackage: (pkg: IPackage) => {
      const name = pkg.meta ? pkg.meta.name + '@' + pkg.meta.version : 'default';
      packages[name] = pkg;
    },

    tryCache: absPath => {
      if (!scope.cache) return;

      const data = scope.cache.restore(absPath);
      return data;
    },
  };

  if (ctx.config.cache.enabled) scope.cache = createCache(ctx, scope);
  else {
    // only created when cache disabled
    scope.moduleIdCacheWhenCacheDisabled = createModuleIdCache(ctx, scope);
  }

  return scope;
}
