import { Context } from './Context';
import { Module } from './Module';
import { Package } from './Package';

export interface IAssembleContext {
  collection: {
    modules: Map<string, Module>;
    packages: {
      add: (pkg: Package) => void;
      get: (name: string, version: string) => undefined | Package;
      getAll: (fn: (pkg: Package) => void) => void;
    };
  };
  flush: () => void;
  getFTLGeneratedContent: () => string;
  getFTLModules: () => Array<Module>;
  getPackageCollection: () => Map<string, Map<string, Package>>;
  setFTLGeneratedContent: (content: string) => void;
  setFTLModule: (module: Module) => void;
}

export enum AssembleState {
  VENDOR_REQUIRED,
}
export function assembleContext(ctx: Context): IAssembleContext {
  let packages = new Map<string, Map<string, Package>>();
  let ftlModules: Array<Module> = [];
  let ftlContent: string;
  const obj = {
    collection: {
      modules: new Map<string, Module>(),

      packages: {
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
        get: (name: string, version: string) => {
          if (packages.has(name)) {
            return packages.get(name).get(version);
          }
        },
        getAll: (fn: (pkg: Package) => void) => {
          packages.forEach(items => {
            items.forEach(pkg => fn(pkg));
          });
        },
      },
    },
    getPackageCollection() {
      return packages;
    },
    flush: () => {
      ftlModules = [];
      packages = new Map();
      ftlContent = '';
      obj.collection.modules = new Map();
    },
    getFTLGeneratedContent: () => {
      return ftlContent;
    },
    getFTLModules: () => ftlModules,
    setFTLGeneratedContent: str => {
      ftlContent = str;
    },
    setFTLModule: (module: Module) => {
      if (ftlModules.indexOf(module) === -1) {
        ftlModules.push(module);
      }
    },
  };
  return obj;
}
