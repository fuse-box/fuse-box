import { IProductionFlow } from '../main';
import { ProductionPackage } from '../ProductionPackage';

export function preparationStage(props: IProductionFlow) {
  const { productionContext, ctx, packages } = props;
  productionContext.productionPackages = [];
  const log = props.ctx.log;

  log.progress('<yellow><bold>- Preparation step - static transform and optimise</bold></yellow>');
  packages.forEach(pkg => {
    productionContext.productionPackages.push(new ProductionPackage(productionContext, pkg));
  });
  log.progressEnd('<green><bold>$checkmark Preparation step completed</bold></green>');
}
