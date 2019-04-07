import { IPackageMeta } from '../resolver/resolver';
import { Context } from './Context';
import { Module } from './Module';
import { IModuleCacheBasics } from '../cache/cache';

export interface IPackageProps {
  ctx: Context;
  meta: IPackageMeta;
}

export interface IPackageCacheContents {
  basics: IModuleCacheBasics;
  meta: IPackageMeta;
}

export class Package {
  public isFlat: boolean;
  public isCached: boolean;
  public cache: IModuleCacheBasics;
  // can be empty
  public entry?: Module;
  public isDefaultPackage: boolean;
  // custom entry collection e.g
  // import "loadash/something" or "import "packages/dist/something"
  public userEntries: Array<Module>;
  public modules: Array<Module>;
  public externalPackages: Array<Package>;
  constructor(public props: IPackageProps) {
    this.modules = [];
    this.userEntries = [];
    this.externalPackages = [];
  }

  public setEntry(module: Module) {
    this.entry = module;
  }

  public getPublicName() {
    if (!this.isFlat) {
      return `${this.props.meta.name}@${this.props.meta.version}`;
    }
    return this.props.meta.name;
  }

  public setCache(basics: IModuleCacheBasics) {
    this.isCached = true;
    this.cache = basics;
  }
}

export function createPackage(props: IPackageProps): Package {
  return new Package(props);
}
