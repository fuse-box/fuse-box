import { IPackageMeta } from '../resolver/resolver';
import { IModule } from './Module';

export interface IPackage {
  id?: string;
  type?: PackageType;
  meta?: IPackageMeta;
  modules?: Record<number, IModule>;
}

export function Package(): IPackage {
  const scope: IPackage = {
    modules: {},
  };
  return scope;
}

export enum PackageType {
  USER_PACKAGE,
  EXTERNAL_PACKAGE,
}

export function createPackage(props: { type: PackageType; meta?: IPackageMeta }): IPackage {
  const pkg = Package();
  pkg.type = props.type;
  pkg.meta = props.meta;

  return pkg;
}
