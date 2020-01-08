import { IProductionContext } from '../ProductionContext';
import { ImportType } from '../module/ImportReference';
import { ModuleType } from '../module/ModuleTree';

export function CodeSplittingPhase(productionContext: IProductionContext) {
  for (const module of productionContext.modules) {
    if (module.isExecutable()) {
      console.log(`parsing: ${module.getShortPath()}`);

      const { moduleTree } = module;

      if (moduleTree.dependants.length > 0) {
        let dynamic = true;
        for (const dependant of moduleTree.dependants) {
          if (dependant.type !== ImportType.DYNAMIC_IMPORT) {
            dynamic = false;
            break;
          }
        }
        if (dynamic) {
          productionContext.splitEntries.register(module);
        }
      }
    }
    //console.log(module.moduleTree.moduleType);
  }
}

/*
function traceOrigin(target: Module) {
  let traced = false;
  for (const dependant of target.productionDependants) {
    if (dependant === splitEntry) traced = true;
    else {
      traced = traceOrigin(dependant);
      if (!traced) return;
    }
  }
  return traced;
}
// go through dependencies and try tracing down the origin
function traceDepedencies(target: Module) {
  for (const dependency of target.productionDependencies) {
    if (traceOrigin(dependency)) {
      submodules.push(dependency);
      traceDepedencies(dependency);
    }
  }
}
traceDepedencies(splitEntry);
*/
