import { createBundleRouter } from '../../bundle/bundleRouter';
import { attachWebIndex } from '../../development/attachWebIndex';
import { createRuntimeRequireStatement } from '../../moduleResolver/moduleResolver';
import { IProductionContext } from '../ProductionContext';

export async function BundlePhase(productionContext: IProductionContext) {
  const { ctx, entries, modules } = productionContext;

  await ctx.ict.resolve();

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
    }
  }

  if (modules) {
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);
    if (productionContext.splitEntries.entries.length > 0) {
      router.generateSplitBundles(productionContext.splitEntries.entries);
    }
    const bundles = await router.writeBundles();

    if (ctx.config.webIndex) {
      await attachWebIndex(ctx, bundles);
    }

    ctx.log.stopStreaming();

    ctx.ict.sync('complete', { bundles, ctx });
  }
}
