import { Context } from '../core/Context';
import { IPackage } from './Package';
import { IModule } from './Module';
import { IPackageMeta } from '../resolver/resolver';

export type IBundleContext = ReturnType<typeof createBundleContext>;
export function createBundleContext(ctx: Context) {
  let currentId = 0;

  const modules: Record<string, IModule> = {};
  const packages: Record<string, IPackage> = {};
  const scope = {
    nextId: () => ++currentId,
    modules,
    packages,
    getPackage: (meta: IPackageMeta): IPackage => {
      const name = meta ? meta.name + '@' + meta.version : 'default';
      return packages[name];
    },
    setPackage: (pkg: IPackage) => {
      const name = pkg.meta ? pkg.meta.name + '@' + pkg.meta.version : 'default';
      packages[name] = pkg;
    },
    getModule: (absPath: string) => {
      return modules[absPath];
    },
    setModule: (module: IModule) => {
      modules[module.absPath] = module;
    },
  };
  return scope;
}
