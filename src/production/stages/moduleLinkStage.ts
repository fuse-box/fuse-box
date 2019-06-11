import { IProductionFlow } from '../main';

export function moduleLinkStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;
  log.progress('<yellow><bold>- Module Link stage - linking modules and packages</bold></yellow>');

  // props.packages.forEach(pkg => {
  //   pkg.
  // })

  productionContext.productionPackages.forEach(pkg => {
    pkg.productionModules.forEach(mod => mod.link());
  });

  log.progressEnd('<green><bold>$checkmark Module Link stage completed</bold></green>');
}
