import { DependencyLink } from './phase1/DependencyLink';
import { IProductionContext } from './ProductionContext';

export function Engine(productionContext: IProductionContext) {
  const phases = [DependencyLink];
  return {
    start: async () => {
      for (const phase of phases) phase(productionContext);
    },
  };
}
