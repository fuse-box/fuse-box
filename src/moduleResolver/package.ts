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
  init: () => void;
}

export function Package(): IPackage {
  const self: IPackage = {
    init: () => {
      self.isUserPackage = self.type === PackageType.USER_PACKAGE;
      self.isExternalPackage = self.type === PackageType.EXTERNAL_PACKAGE;
    },
  };
  return self;
}

export enum PackageType {
  USER_PACKAGE,
  EXTERNAL_PACKAGE,
}

export function createPackageFromCache(data: Record<string, any>): IPackage {
  const pkg = Package();
  for (const key in data) pkg[key] = data[key];
  pkg.init();
  return pkg;
}
export function createPackage(props: { meta?: IPackageMeta; type?: PackageType }): IPackage {
  const pkg = Package();
  pkg.type = props.type;
  pkg.meta = props.meta;
  pkg.publicName = pkg.meta ? pkg.meta.name + '@' + pkg.meta.version : 'default';
  pkg.init();
  return pkg;
}
