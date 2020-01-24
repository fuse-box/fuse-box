import { IProductionContext } from './ProductionContext';
import { BundlePhase } from './phases/BundlePhase';
import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { WarmupPhase } from './phases/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const defaultPhases = [WarmupPhase, CodeSplittingPhase, BundlePhase];

  return {
    start: (phases?: Array<(productionContext: IProductionContext) => void>) => {
      phases = phases || defaultPhases;
      for (const phase of phases) {
        phase(productionContext);
      }
    },
  };
}
