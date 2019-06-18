import { ITypescriptTarget } from '../interfaces/TypescriptInterfaces';

export interface IProductionProps {
  screwIE?: boolean;
  uglify?: any;
  target?: ITypescriptTarget;
}
