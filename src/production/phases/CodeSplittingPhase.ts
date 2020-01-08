import { Module } from '../../core/Module';
import { IProductionContext } from '../ProductionContext';
import { ImportType, IImport } from '../module/ImportReference';

export function CodeSplittingPhase(productionContext: IProductionContext) {
  let possibleSplitEntry;

  for (possibleSplitEntry of productionContext.modules) {
    if (
      !possibleSplitEntry.isEntry() &&
      possibleSplitEntry.pkg.isDefaultPackage
    ) {
      // console.log(`parsing: ${possibleSplitEntry.getShortPath()}`);
      const { moduleTree } = possibleSplitEntry;
      let isDynamic = true;

      for (const dependant of moduleTree.dependants) {
        if (dependant.type !== ImportType.DYNAMIC_IMPORT) {
          isDynamic = false;
          break;
        }
      }

      // go figure out it's submodules to bundle in this split
      if (isDynamic) {
        const subModules = traverseDependencies(possibleSplitEntry);
        productionContext.splitEntries.register(possibleSplitEntry, subModules);
      }
    }
  }

  function traceOrigin(target: Module): boolean {
    let traced = false;
    for (const { module } of target.moduleTree.dependants) {
      if (module === possibleSplitEntry) {
        traced = true;
      } else {
        traced = traceOrigin(module);
        if (!traced) break;
      }
    }
    return traced;
  }

  function traverseDependencies(target: Module): Array<IImport> {
    let subModules = [];
    for (const dependency of target.moduleTree.importReferences.references) {
      if (traceOrigin(dependency.target)) {
        subModules = subModules.concat(
          [dependency],
          traverseDependencies(dependency.target),
        );
      }
    }
    return subModules;
  }
}
