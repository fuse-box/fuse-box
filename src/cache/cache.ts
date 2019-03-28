import * as path from 'path';
import { Context } from '../core/Context';
import { env } from '../core/env';
import { ensureDir, fileExists, readFile, writeFile } from '../utils/utils';
import { ICacheTreeContents, ICacheDependencies, ICachePackageResponse, ICachePackage } from './Interfaces';
import { Package, createPackage } from '../core/Package';

export function generateValidKey(key) {
  return encodeURIComponent(key) + '.cache';
}

export interface IFileCacheProps {
  ctx: Context;
}

export interface IModuleCacheBasics {
  contents: string;
  sourceMap: string;
}

const TREE_FILE_KEY = 'tree.json';

export class Cache {
  private rootFolder: string;

  private unsynced = new Map<string, any>();
  private synced = new Map<string, any>();
  public ctx: Context;
  constructor(props: IFileCacheProps) {
    const config = props.ctx.config;
    this.ctx = props.ctx;
    this.rootFolder = config.options.cacheRoot;
  }

  public init() {
    ensureDir(path.join(this.rootFolder, env.CACHE.PACKAGES));
    ensureDir(path.join(this.rootFolder, env.CACHE.PROJET_FILES));
  }

  public set(key: string, value: any) {
    key = generateValidKey(key);
    this.synced.delete(key);
    this.unsynced.set(key, value);
  }

  public forceSyncOnKey(key: string) {
    if (this.synced.get(key)) {
      this.unsynced.set(key, this.synced.get(key));
      this.synced.delete(key);
    }
  }
  /**
   * get dependency tree (here we store all information about cached packages)
   *
   * @returns
   * @memberof FileAdapter
   */
  public getTree() {
    let tree: ICacheTreeContents = this.get<ICacheTreeContents>(TREE_FILE_KEY);
    if (!tree) {
      tree = {
        packages: {},
      };
      this.set(TREE_FILE_KEY, tree);
    }
    return tree;
  }

  public get<T>(key: string): T {
    key = generateValidKey(key);

    if (this.synced.has(key)) {
      return this.synced.get(key);
    }

    if (this.unsynced.has(key)) {
      return this.unsynced.get(key);
    }

    const targetFile = path.join(this.rootFolder, key);

    if (fileExists(targetFile)) {
      const contents = readFile(targetFile);
      this.synced.set(key, JSON.parse(contents));
      return this.synced.get(key);
    }
  }

  public clearMemory() {
    this.unsynced = new Map();
    this.synced = new Map();
  }

  public async sync() {
    const writers: Array<Promise<any>> = [];
    for (const item of this.unsynced) {
      const [key, value] = item;
      writers.push(writeFile(path.join(this.rootFolder, key), JSON.stringify(value)));
      // it's synced now

      this.synced.set(key, value);
    }
    await Promise.all(writers);
    // reset unsynced
    this.unsynced = new Map();
  }

  public clearTree() {
    const tree = this.getTree();
    tree.packages = {};
  }

  private getPackageKey(pkg: Package) {
    return `${pkg.props.meta.name}-${pkg.props.meta.version}`;
  }

  public getPackage(pkg: Package): ICachePackageResponse {
    const tree = this.getTree();

    const meta = pkg.props.meta;
    const response: ICachePackageResponse = {};
    if (!tree.packages[meta.name]) {
      response.abort = true;

      // we don't want to retreive anything from cache if even one package is missing
      this.clearTree();
      return response;
    }

    const dest = tree.packages[meta.name][meta.version];

    if (!dest) {
      // same here, drop everything
      this.clearTree();

      response.abort = true;
      return response;
    }

    // checking here if user entries e.g libary/foo.js, library/boo.js
    // all present in the cache.
    // If a new partial require was spotted and/or used a different entry
    let moduleMismatch = false;
    pkg.modules.forEach(item => {
      item.props.fuseBoxPath;
      if (!dest.modules.includes(item.props.fuseBoxPath)) {
        moduleMismatch = true;
      }
    });

    // retrieve cache for this package
    if (!moduleMismatch) {
      const cache = this.get<IModuleCacheBasics>(this.getPackageKey(pkg));

      if (!cache) {
        response.abort = true;
      } else {
        pkg.setCache(cache);
      }
    }

    if (response.abort) {
      return response;
    }

    // if the package isn't aborted (the cache is valid)
    // we should collect all the dependencies with its cache
    const packageCollection = {};

    const collectAllSubDependencies = (list: ICacheDependencies) => {
      list.map(item => {
        if (!tree.packages[item.name] || !tree.packages[item.name][item.version]) {
          response.abort = true;

          this.clearTree();
          return;
        }
        // check if it wasn't added before
        // to avoid an infinite loop
        if (!response.abort) {
          const key = `${item.name}-${item.version}`;
          const info = tree.packages[item.name][item.version];
          if (!packageCollection[key]) {
            const targetPackage = createPackage({
              ctx: this.ctx,
              meta: info.meta,
            });
            const cacheKey = this.getPackageKey(targetPackage);
            const cache = this.get<IModuleCacheBasics>(cacheKey);
            // if one of the cached version is missing - abort
            // cache should be reset
            if (!cache) {
              response.abort = true;
              this.clearTree();
              return;
            }
            targetPackage.setCache(cache);
            packageCollection[key] = targetPackage;

            const targetPackagInfo = tree.packages[item.name][item.version];
            if (targetPackagInfo.dependencies) {
              collectAllSubDependencies(targetPackagInfo.dependencies);
            }
          }
        }
      });
    };
    collectAllSubDependencies(dest.dependencies);
    if (response.abort) {
      return response;
    }

    const dependants: Array<Package> = [];
    for (const key in packageCollection) {
      dependants.push(packageCollection[key]);
    }

    return {
      target: {
        moduleMismatch,
        pkg,
      },
      dependants: dependants,
    };
  }

  public savePackage(pkg: Package, basics: IModuleCacheBasics) {
    const tree = this.getTree();
    const meta = pkg.props.meta;
    if (!tree.packages[meta.name]) {
      tree.packages[meta.name] = {};
    }
    const deps = pkg.externalPackages.map(externalPackage => ({
      name: externalPackage.props.meta.name,
      version: externalPackage.props.meta.version,
    }));
    const modules = pkg.modules.map(mod => mod.props.fuseBoxPath);
    const obj: ICachePackage = {
      name: meta.name,
      version: meta.version,
      dependencies: deps,
      meta: meta,
      modules: modules,
    };
    tree.packages[pkg.props.meta.name][meta.version] = obj;

    const cache_key = this.getPackageKey(pkg);
    this.set(cache_key, basics);
    this.forceSyncOnKey(TREE_FILE_KEY);
  }
}

export function createCache(props: IFileCacheProps) {
  return new Cache(props);
}
