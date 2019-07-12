import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { createProductionContext, ProductionContext } from './ProductionContext';
import { moduleLinkStage } from './stages/moduleLInkStage';
import { preparationStage } from './stages/preparationStage';
import { referenceLinkStage } from './stages/referenceLinkStage';
import { treeShakingStage } from './stages/treeShakingStage';
import { transpileStage } from './stages/transpileStage';
import { generationStage } from './stages/generationStage';
import { finalStage } from './stages/finalStage';
import { IBundleWriteResponse } from '../bundle/Bundle';
import { codeSplittingStage } from './stages/codeSplittingStage';

export interface IProductionMain {
  packages: Array<Package>;
  ctx: Context;
}

export interface IProductionFlow {
  productionContext: ProductionContext;
  packages: Array<Package>;
  ctx: Context;
}

export async function productionMain(props: IProductionMain): Promise<Array<IBundleWriteResponse>> {
  const productionContext = createProductionContext(props);
  const flow: IProductionFlow = { productionContext, ctx: props.ctx, packages: props.packages };

  /** Stage 1 */
  // Replace process, add polyfills
  // unwrap if conditions with dead code elimination
  // replace FuseBox.iServer and FuseBox.isBrowser
  // some other
  preparationStage(flow);

  // after this stage, productionContext has:
  // productionContext.productionPackages which contain transform (but not transpiled sources ready for further transformations)

  // TREE SHAKING STAGES *********************************************************************************************************

  /** Stage 2 */
  moduleLinkStage(flow);
  // at this stage we need to resolve and most importantly link all production modules and packages for further treeshaking
  // and other manupulations

  // having import references in places and we now link all the imports and exports
  // to count references
  referenceLinkStage(flow);

  //treeShakingStage(flow);

  codeSplittingStage(flow);

  transpileStage(flow);

  generationStage(flow);

  // writing bundles and such
  const bundles = await finalStage(flow);
  props.ctx.ict.sync('complete', { bundles: bundles, ctx: props.ctx, packages: props.packages });
  return bundles;
}
