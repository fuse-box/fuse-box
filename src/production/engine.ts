import { IProductionContext } from './ProductionContext';
import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { WarmupPhase } from './phases/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const phases = [WarmupPhase, CodeSplittingPhase];

  return {
    start: async () => {
      for (const phase of phases) {
        phase(productionContext);
      }
    },
    startPhases: async customPhases => {
      for (const phase of customPhases) {
        phase(productionContext);
      }
    },
  };
}
