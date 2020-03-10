import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';
import { IPublicOutputConfig } from '../output/OutputConfigInterface';
import { IManifest } from './IManifest';
import { ITarget } from './ITarget';

export interface IRunProps {
  buildTarget?: ITypescriptTarget;
  bundles?: IPublicOutputConfig;
  cleanCSS?: any;
  manifest?: IManifest | boolean;
  target?: ITarget;
  tsHelpersPath?: string;
  uglify?: any;
}
