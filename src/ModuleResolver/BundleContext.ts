import { Context } from '../core/Context';
import { IPackage } from './Package';
import { IModule } from './Module';
import { IPackageMeta } from '../resolver/resolver';
import { createCache, ICache } from '../cache/cache';

export type IBundleContext = ReturnType<typeof createBundleContext>;
export function createBundleContext(ctx: Context) {
  let currentId = 0;

  const modules: Record<string, IModule> = {};
  const packages: Record<string, IPackage> = {};

  let cache: ICache;
  const scope = {
    currentId,
    nextId: () => ++scope.currentId,
    modules,
    cache,
    packages,
    getPackage: (meta: IPackageMeta): IPackage => {
      const name = meta ? meta.name + '@' + meta.version : 'default';
      return packages[name];
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
    getModule: (absPath: string) => {
      return modules[absPath];
    },
    setModule: (module: IModule) => {
      modules[module.absPath] = module;
    },
  };

  if (ctx.config.cache.enabled) scope.cache = createCache(ctx, scope);

  return scope;
}
