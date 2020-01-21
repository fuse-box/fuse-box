import { Context } from '../core/Context';
import { createProductionContext } from './ProductionContext';
import { Engine } from './engine';

export function bundleProd(ctx: Context) {
  const context = createProductionContext(ctx);
  Engine(context).start();
}
