import { IProductionContext } from '../ProductionContext';

/**
 * @todo:
 * - Create a new phase
 * - Loop modules and call transpile()
 * - fix require statements
 * - call generate()
 * - pipe that shit BundleRouter
 * - fix bundle router to understand splitEntry
 */

export function FinalPhase(productionContext: IProductionContext) {
  console.log(productionContext.splitEntries);
  for (const module of productionContext.modules) {
    if (module.isExecutable) {
      module.transpile();
    }
  }
}
