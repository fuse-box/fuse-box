import { Context } from '../core/Context';
import { Package } from '../core/Package';

export class ProductionContext {
  constructor(public ctx: Context, public packages: Array<Package>) {}
}
