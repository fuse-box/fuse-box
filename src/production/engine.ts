import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { WarmupPhase } from './phases/WarmupPhase';

import { IProductionContext } from './ProductionContext';

export function Engine(productionContext: IProductionContext) {
  const phases = [WarmupPhase, CodeSplittingPhase];

  return {
    start: async () => {
      for (const phase of phases) {
        phase(productionContext);
      }
    }
  };
}
