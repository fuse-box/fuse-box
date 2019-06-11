import { Package } from '../core/Package';
import { ProductionModule } from './ProductionModule';
import { ProductionContext } from './ProductionContext';

export class ProductionPackage {
  public productionModules: Array<ProductionModule>;
  constructor(public context: ProductionContext, public pkg: Package) {
    this.productionModules = [];
    pkg.productionPackage = this;
    pkg.modules.forEach(module => {
      this.productionModules.push(new ProductionModule(this.context, module, this));
    });
    const log = pkg.props.ctx.log;
  }
}
