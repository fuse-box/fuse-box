import { IProductionContext } from './ProductionContext';
import { WarmupPhase } from './phase1/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const phases = [WarmupPhase];
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
