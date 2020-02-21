import { createBuild } from '../../core/build';
import { createRuntimeRequireStatement } from '../../moduleResolver/moduleResolver';
import { IProductionContext } from '../ProductionContext';

export async function BundlePhase(productionContext: IProductionContext) {
  const { ctx, entries, modules } = productionContext;

  for (const module of modules) {
    if (module.isExecutable) {
      productionContext.log.info('generate', module.publicPath);
      const transformerResult = module.transpile();
      for (const item of transformerResult.requireStatementCollection) {
        item.statement = createRuntimeRequireStatement({ ctx, item, module });
      }
      module.generate();
      if (ctx.config.productionBuildTarget) {
        productionContext.log.info('down transpile', module.publicPath);
        // need to down transpile
        module.transpileDown(ctx.config.productionBuildTarget);
      }
    } else {
      productionContext.log.info('add', module.publicPath);
    }
  }

  if (modules) {
    productionContext.runResponse = await createBuild({
      bundleContext: productionContext.bundleContext,
      entries,
      modules: productionContext.modules,
      splitEntries: productionContext.splitEntries,
      ctx,
    });
  }
}
