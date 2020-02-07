import { createBundleRouter } from '../../bundle/bundleRouter';
import { createRuntimeRequireStatement } from '../../moduleResolver/moduleResolver';
import { IProductionContext } from '../ProductionContext';
import { createServerEntry } from '../module/ServerEntry';

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
    const bundles = await router.writeBundles();

    productionContext.runResponse = {
      bundleContext: productionContext.bundleContext,
      bundles: bundles,
      entries: entries,
      modules: productionContext.modules,
      splitEntries: productionContext.splitEntries,
    };

    // create a server bundle if we have more than 1 bundle in a server setup
    if (ctx.config.target === 'server' && bundles.length > 1) bundles.push(await createServerEntry(ctx, bundles));

    ctx.log.stopStreaming();
    ctx.ict.sync('complete', productionContext.runResponse);
  }
}
