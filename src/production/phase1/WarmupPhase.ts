import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { BASE_TRANSFORMERS, isTransformerEligible } from '../../compiler/transformer';
import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { PRODUCTION_TRANSFORMERS } from '../transformers/collection';
import { transpileModule } from '../../compiler/program/transpileModule';
import { createGlobalContext } from '../../compiler/program/GlobalContext';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ModuleTree } from '../module/ModuleTree';

function launchPhaseOne(productionContext: IProductionContext, module: Module) {
  const ctx = productionContext.ctx;

  const List: Array<ITransformer> = [
    ...productionContext.ctx.userTransformers,
    ...BASE_TRANSFORMERS,
    ...PRODUCTION_TRANSFORMERS,
  ];

  const transformers = [];
  for (const transformer of List) {
    if (transformer.productionWarmupPhase && isTransformerEligible(module, transformer)) {
      transformers.push(
        transformer.productionWarmupPhase({ ctx: ctx, module: module, productionContext: productionContext }),
      );
    }
  }

  transpileModule({
    ast: module.ast as ASTNode,
    globalContext: createGlobalContext(),
    transformers: transformers,
  });
}
export function WarmupPhase(productionContext: IProductionContext) {
  for (const module of productionContext.modules) {
    if (module.isExecutable()) {
      // flush the AST. We only need to do it once on warmup phase
      // laters on we will be working with the same AST
      module.parse();

      // create and assign module tree
      module.moduleTree = ModuleTree(productionContext, module);
      launchPhaseOne(productionContext, module);
    }
  }
}
