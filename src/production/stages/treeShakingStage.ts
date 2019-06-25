import { IProductionFlow } from '../main';
import { Module } from '../../core/Module';

function treeShakeEntry(entry: Module) {
  entry.productionModule.structure.links.forEach(link => {
    link.exports.forEach(_export => {
      if (_export.hasExternalDependants()) {
      }
    });
  });
}
export function treeShakingStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;

  productionContext.productionPackages.forEach(pkg => {
    pkg.productionModules.forEach(mod => mod.treeShake());
  });
  log.progress('<yellow><bold>- Tree shaking modules </bold></yellow>');
  productionContext.productionPackages.forEach(pkg => {
    if (!pkg.pkg.isDefaultPackage) {
      log.progress('<dim><bold>- Tree shaking module $name </bold></dim>', { name: pkg.pkg.getPublicName() });

      //const entries = pkg.pkg.getAllEntries();
      //entries.forEach(entry => treeShakeEntry(entry));
    }
  });

  log.progressEnd('<green><bold>$checkmark Tree shaking completed</bold></green>');
}
