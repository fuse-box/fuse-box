import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IPublicOutputConfig } from '../output/OutputConfigInterface';
import { UserHandler } from '../user-handler/UserHandler';
import { IManifest } from './IManifest';

export interface IProductionProps {
  bundles?: IPublicOutputConfig;
  cleanCSS?: any;
  manifest?: IManifest | boolean;
  screwIE?: boolean;
  target?: ITypescriptTarget;
  uglify?: any;
  handler?: (handler: UserHandler) => void;
}
