import { IPackageMeta } from '../resolver/resolver';

export interface IPackage {
  deps?: Array<number>;
  id?: string;
  isExternalPackage?: boolean;
  isUserPackage?: boolean;
  meta?: IPackageMeta;
  mtime?: number;
  publicName?: string;
  type?: PackageType;
}

export function Package(): IPackage {
  const scope: IPackage = {};
  return scope;
}

export enum PackageType {
  USER_PACKAGE,
  EXTERNAL_PACKAGE,
}

export function createPackage(props: { meta?: IPackageMeta; type?: PackageType }): IPackage {
  const pkg = Package();
  pkg.type = props.type;
  pkg.meta = props.meta;
  pkg.publicName = pkg.meta ? pkg.meta.name + '@' + pkg.meta.version : 'default';

  return pkg;
}
