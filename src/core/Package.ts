import { IPackageMeta } from '../resolver/resolver';
import { Context } from './Context';
import { Module } from './Module';

export interface IPackageProps {
  ctx: Context;
  meta: IPackageMeta;
}
export class Package {
  public isCached: boolean;
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
}

export function createPackage(props: IPackageProps): Package {
  return new Package(props);
}
