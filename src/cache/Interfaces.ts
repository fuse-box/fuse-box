import { Package } from '../core/Package';
import { IPackageMeta } from '../resolver/resolver';

export interface ICacheAdapter {
  init();
  set(key: string, value: any);
  get<T>(key: string): T;
  ensure<T>(key: string): T;
  sync(): void;
}

export interface ICacheRequest {
  name: string;
  version: string;
  forModules: Array<string>;
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
  name: string;
  version: string;
  modules: Array<string>;
  meta?: IPackageMeta;
  dependencies?: ICacheDependencies;
}

export type ICachePackages = { [version: string]: ICachePackage };

export interface ICacheTreeContents {
  packages: { [name: string]: ICachePackages };
}

export interface ICachePackageResponse {
  abort?: boolean;
  target?: {
    moduleMismatch?: boolean;
    pkg: Package;
  };
  dependants?: Array<Package>;
}
