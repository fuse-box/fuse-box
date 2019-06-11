import { Package } from '../core/Package';
import { Context } from '../core/Context';
import { ProductionPackage } from './ProductionPackage';
import { ILogger } from '../logging/logging';

export interface IProductionContext {
  packages: Array<Package>;
  ctx: Context;
}

export class ProductionContext {
  public productionPackages: Array<ProductionPackage>;
  private log: ILogger;
  constructor(props: IProductionContext) {}
}
export function createProductionContext(props: IProductionContext): ProductionContext {
  return new ProductionContext(props);
}
