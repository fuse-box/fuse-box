import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { ProductionPhase_1_Init } from './ProductionPhase1_Init';
import { Context } from '../../core/Context';
import { Package } from '../../core/Package';
import { BASE_TRANSFORMERS } from '../../compiler/transformer';
import { ProductionContext } from '../ProductionContext';

export const PRODUCTION_TRANSFORMERS: Array<ITransformer> = [ProductionPhase_1_Init()];

export function launchProductionInit(ctx: Context, packages: Array<Package>) {
  const userTransformers = ctx.userTransformers;

  const productionContext = new ProductionContext(ctx, packages);

  const List: Array<ITransformer> = [...userTransformers, ...BASE_TRANSFORMERS, ...PRODUCTION_TRANSFORMERS];
  for (const transformer of List) {
    if (transformer.productionInit) {
      transformer.productionInit(productionContext);
    }
  }
}
