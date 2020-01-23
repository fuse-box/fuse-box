import { IProductionContext } from './ProductionContext';
import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { FinalPhase } from './phases/FinalPhase';
import { WarmupPhase } from './phases/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const defaultPhases = [WarmupPhase, CodeSplittingPhase, FinalPhase];

  return {
    start: (phases?: Array<(productionContext: IProductionContext) => void>) => {
      phases = phases || defaultPhases;
      for (const phase of phases) {
        phase(productionContext);
      }
    },
  };
}
