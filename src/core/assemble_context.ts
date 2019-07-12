import { Context } from './Context';
import { Module } from './Module';
import { Package } from './Package';

export interface IAssembleContext {
  flush: () => void;
  addFTL: (path: string, content: string) => void;
  getFTL: () => Map<string, string>;
  getPackageCollection: () => Map<string, Map<string, Package>>;
  collection: {
    modules: Map<string, Module>;
    packages: {
      getAll: (fn: (pkg: Package) => void) => void;
      get: (name: string, version: string) => Package | undefined;
      add: (pkg: Package) => void;
    };
  };
}

export enum AssembleState {
  VENDOR_REQUIRED,
}
export function assembleContext(ctx: Context): IAssembleContext {
  let packages = new Map<string, Map<string, Package>>();
  let ftl = new Map<string, string>();
  const obj = {
    addFTL: (path: string, content: string) => {
      ftl.set(path, content);
    },
    getFTL: () => ftl,
    flush: () => {
      ftl = new Map();
      packages = new Map();
      obj.collection.modules = new Map();
    },
    getPackageCollection() {
      return packages;
    },
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
  return obj;
}
