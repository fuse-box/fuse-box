export interface IDependenciesPublic {
  ignore?: Array<string | RegExp>;
  importRefs?: Array<IImportRef> | Record<string, string | IImportRef>;
  include?: Array<string>;
  serverIgnoreExternals?: boolean;
}

export interface IImportRef {
  bundle?: boolean;
  matching: RegExp | string;
  replacement: string;
}

export interface IDependencies {
  ignore?: Array<string | RegExp>;
  importRefs?: Array<IImportRef>;
  include?: Array<string>;
  serverIgnoreExternals?: boolean;
}
