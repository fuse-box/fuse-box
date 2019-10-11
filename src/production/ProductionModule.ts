import { ProductionContext } from './ProductionContext';

export interface IProductionModuleProps {
  productionContext: ProductionContext;
}
export class ProductionModule {
  constructor(public props: IProductionModuleProps) {}
}
