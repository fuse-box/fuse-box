import { Package } from '../core/Package';
import { ProductionModule } from './ProductionModule';
import { ProductionContext } from './ProductionContext';

export class ProductionPackage {
  public productionModules: Array<ProductionModule>;
  constructor(public context: ProductionContext, public pkg: Package) {
    this.productionModules = [];
  }
}
