export interface ICacheAdapter {
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

export interface ICachePackage {
  name: string;
  version: string;
  packageJSONLocation: string;
  modules: Array<string>;
  dependencies?: Array<{ name: string; version: string }>;
}

export type ICachePackages = { [version: string]: ICachePackage };

export interface ICacheTreeContents {
  packages: { [name: string]: ICachePackages };
}
