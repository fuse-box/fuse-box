import { createBundleRouter } from '../../bundle/bundleRouter';
import { createRunResponse } from '../../core/runResponse';
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
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);
    if (productionContext.splitEntries.entries.length > 0) {
      router.generateSplitBundles(productionContext.splitEntries.entries);
    }
    await ctx.ict.resolve();

    const { bundles, manifest, onComplete } = await createRunResponse(ctx, router);

    productionContext.runResponse = {
      bundleContext: productionContext.bundleContext,
      bundles,
      entries,
      manifest,
      modules: productionContext.modules,
      onComplete,
      splitEntries: productionContext.splitEntries,
    };

    ctx.log.stopStreaming();
    ctx.ict.sync('complete', productionContext.runResponse);
  }
}
