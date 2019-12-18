import { Package } from '../core/Package';
import { IPackageMeta } from '../resolver/resolver';

export interface ICacheAdapter {
  ensure<T>(key: string): T;
  get<T>(key: string): T;
  init();
  set(key: string, value: any);
  sync(): void;
}

export interface ICacheRequest {
  forModules: Array<string>;
  name: string;
  version: string;
}

export type ICacheResponse = Array<{
  content: ICachePackageContent;
  meta: ICachePackage;
}>;

export interface ICachePackageContent {
  compiled: string;
  sourceMap: string;
}

export type ICacheDependencies = Array<{ name: string; version: string }>;
export interface ICachePackage {
  dependencies?: ICacheDependencies;
  meta?: IPackageMeta;
  modules: Array<string>;
  name: string;
  version: string;
}

export type ICachePackages = { [version: string]: ICachePackage };

export interface ICacheTreeContents {
  packages: { [name: string]: ICachePackages };
}

export interface ICachePackageResponse {
  abort?: boolean;
  dependants?: Array<Package>;
  target?: {
    moduleMismatch?: boolean;
    pkg: Package;
  };
}
