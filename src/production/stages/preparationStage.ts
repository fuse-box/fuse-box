import { Project } from 'ts-morph';
import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import { ProductionPackage } from '../ProductionPackage';
import { performStaticTransformations } from '../transformation';
import { Context } from '../../core/Context';

interface IStaticTransform {
  productionModule: ProductionModule;
  ctx: Context;
}

function staticTransform(props: IStaticTransform) {
  const module = props.productionModule.module;
  if (module.isExecutable()) {
    props.ctx.log.progressFormat('Source transform', module.getShortPath());

    const project = new Project();
    props.productionModule.file = project.createSourceFile('src/foo.ts', module.contents);
    performStaticTransformations({
      ctx: module.props.ctx,
      file: props.productionModule.file,
      fuseBoxPath: module.props.fuseBoxPath,
    });
  }
}
export function preparationStage(props: IProductionFlow) {
  const { productionContext, ctx, packages } = props;
  productionContext.productionPackages = [];
  const log = props.ctx.log;

  log.progress('<dim><bold>- Preparation step - static transform and optimise</bold></dim>');
  packages.forEach(pkg => {
    const productionPackage = new ProductionPackage(productionContext, pkg);
    pkg.productionPackage = productionPackage;
    pkg.modules.forEach(module => {
      const productionModule = new ProductionModule(productionContext, module, productionPackage);
      module.productionModule = productionModule;
      productionPackage.productionModules.push(productionModule);
      staticTransform({ productionModule, ctx });
    });
    productionContext.productionPackages.push(productionPackage);
  });
  log.progressEnd('<green><bold>$checkmark Preparation step completed</bold></green>');
}
