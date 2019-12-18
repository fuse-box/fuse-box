import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { UserHandler } from '../user-handler/UserHandler';
import { IManifest } from './IManifest';

export interface IProductionProps {
  cleanCSS?: any;
  manifest?: IManifest | boolean;
  screwIE?: boolean;
  target?: ITypescriptTarget;
  uglify?: any;
  handler?: (handler: UserHandler) => void;
}
