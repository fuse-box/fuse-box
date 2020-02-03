import { IImportRef } from './IImportRef';

export interface IDependencies {
  importRefs?: Array<IImportRef>;
  include?: Array<string>;
  serverIgnore?: Array<string | RegExp>;
  serverIgnoreExternals?: boolean;
}
