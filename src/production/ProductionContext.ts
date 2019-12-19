import { Context } from '../core/Context';
import { Package } from '../core/Package';

export function ProductionContext(ctx: Context, packages: Array<Package>) {
  return {
    packages,
    ctx,
  };
}
export type IProductionContext = ReturnType<typeof ProductionContext>;
