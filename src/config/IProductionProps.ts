import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { UserHandler } from '../user-handler/UserHandler';
import { IManifest } from './IManifest';

export interface IProductionProps {
  screwIE?: boolean;
  uglify?: any;
  target?: ITypescriptTarget;
  handler?: (handler: UserHandler) => void;
  manifest?: IManifest | boolean;
}
