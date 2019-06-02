import { Package } from '../core/Package';
import { Context } from '../core/Context';

export interface IProductionContext {
  packages: Array<Package>;
  ctx: Context;
}

export class ProductionContext {
  constructor(props: IProductionContext) {}
}
export function createProductionContext(props: IProductionContext) {
  const p_ctx = new ProductionContext(props);
}
