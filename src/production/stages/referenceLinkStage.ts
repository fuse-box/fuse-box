import { IProductionFlow } from '../main';

export function referenceLinkStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;
  log.progress('<yellow><bold>- Reference Link stage - linking exports/imports</bold></yellow>');

  productionContext.productionPackages.forEach(pkg => {
    pkg.productionModules.forEach(mod => mod.referenceLink());
  });

  log.progressEnd('<green><bold>$checkmark Reference Link stage completed</bold></green>');
}
