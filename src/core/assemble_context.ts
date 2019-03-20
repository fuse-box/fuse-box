import { Context } from './Context';
import { Module } from './Module';
import { Package } from './Package';

export interface IAssembleContext {
  collection: {
    modules: Map<string, Module>;
    packages: {
      getAll: (fn: (pkg: Package) => void) => void;
      get: (name: string, version: string) => Package | undefined;
      add: (pkg: Package) => void;
    };
  };
}
export function assembleContext(ctx: Context): IAssembleContext {
  const packages = new Map<string, Map<string, Package>>();
  return {
    collection: {
      modules: new Map<string, Module>(),
      packages: {
        getAll: (fn: (pkg: Package) => void) => {
          packages.forEach(items => {
            items.forEach(pkg => fn(pkg));
          });
        },
        get: (name: string, version: string) => {
          if (packages.has(name)) {
            return packages.get(name).get(version);
          }
        },
        add: (pkg: Package) => {
          const name = pkg.props.meta.name;
          const version = pkg.props.meta.version;
          if (packages.has(name)) {
            pkg.isFlat = false;
            packages.get(name).set(version, pkg);
          } else {
            const record = packages.set(name, new Map<string, Package>());
            pkg.isFlat = true;
            record.get(name).set(version, pkg);
          }
        },
      },
    },
  };
}
