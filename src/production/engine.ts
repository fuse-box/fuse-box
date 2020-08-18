import { IProductionContext } from './ProductionContext';
import { BundlePhase } from './phases/BundlePhase';
import { CodeSplittingPhase } from './phases/CodeSplittingPhase';
import { WarmupPhase } from './phases/WarmupPhase';

export function Engine(productionContext: IProductionContext) {
  const defaultPhases = [WarmupPhase, CodeSplittingPhase, BundlePhase];

  return {
    start: async (phases?: Array<(productionContext: IProductionContext) => void>) => {
      phases = phases || defaultPhases;

      for (const phase of phases) {
        const name = phase.toString().match(/function (\w+)/i)[1];
        productionContext.log.info('phase', `Running ${name}`);
        await phase(productionContext);
      }
    },
  };
}
