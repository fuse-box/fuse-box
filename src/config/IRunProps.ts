import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IPublicOutputConfig } from '../output/OutputConfigInterface';
import { UserHandler } from '../userHandler/UserHandler';
import { IManifest } from './IManifest';

export interface IRunProps {
  bundles?: IPublicOutputConfig;
  cleanCSS?: any;
  manifest?: IManifest | boolean;
  screwIE?: boolean;
  target?: ITypescriptTarget;
  uglify?: any;
  handler?: (handler: UserHandler) => void;
}
