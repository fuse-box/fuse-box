import { transformModule } from '../../compiler/core/transformModule';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { BASE_TRANSFORMERS, isTransformerEligible } from '../../compiler/transformer';
import { IModule } from '../../moduleResolver/module';
import { IProductionContext } from '../ProductionContext';
import { PRODUCTION_TRANSFORMERS } from '../transformers/collection';

function runWarmupPhase(productionContext: IProductionContext, module: IModule) {
  const ctx = productionContext.ctx;

  const List: Array<ITransformer> = [
    ...productionContext.ctx.userTransformers,
    ...BASE_TRANSFORMERS,
    ...PRODUCTION_TRANSFORMERS,
  ];

  const transformers = [];
  for (const transformer of List) {
    if (transformer.productionWarmupPhase && isTransformerEligible(module.absPath, transformer)) {
      transformers.push(
        transformer.productionWarmupPhase({ ctx: ctx, module: module, productionContext: productionContext }),
      );
    }
  }

  transformModule({
    root: module.ast as ASTNode,
    transformers: transformers,
  });
}

export function WarmupPhase(productionContext: IProductionContext) {
  for (const module of productionContext.modules) {
    if (module.isExecutable) {
      // flush the AST. We only need to do it once on warmup phase
      // laters on we will be working with the same AST
      module.parse();
      runWarmupPhase(productionContext, module);
    }
  }
}
