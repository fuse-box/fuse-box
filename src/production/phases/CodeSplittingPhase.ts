import { IProductionContext } from '../ProductionContext';

export function CodeSplittingPhase(productionContext: IProductionContext) {
  for (const module of productionContext.modules) {
    console.log(module.moduleTree);
  }
}
