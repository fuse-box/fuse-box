import { Package } from '../core/Package';
import { ProductionContext } from './ProductionContext';
import { ProductionModule } from './ProductionModule';

export class ProductionPackage {
  public productionModules: Array<ProductionModule>;
  constructor(public context: ProductionContext, public pkg: Package) {
    this.productionModules = [];
  }
}
