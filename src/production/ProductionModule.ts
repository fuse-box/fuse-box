import { IProductionContext } from './ProductionContext';

export interface IProductionModuleProps {
  productionContext: IProductionContext;
}
export class ProductionModule {
  constructor(public props: IProductionModuleProps) { }
}
