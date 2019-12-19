import { WarmupPhase } from './phase1/WarmupPhase';
import { IProductionContext } from './ProductionContext';

export function Engine(productionContext: IProductionContext) {
  const phases = [WarmupPhase];
  return {
    start: async () => {
      for (const phase of phases) phase(productionContext);
    },
  };
}
