import { IProductionContext } from './ProductionContext';
import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { FinalPhase } from './phases/FinalPhase';
import { WarmupPhase } from './phases/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const phases = [WarmupPhase, CodeSplittingPhase, FinalPhase];

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
