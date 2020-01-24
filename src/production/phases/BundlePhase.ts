import { createBundleRouter } from '../../bundle/bundleRouter';
import { createRuntimeRequireStatement } from '../../moduleResolver/moduleResolver';
import { IProductionContext } from '../ProductionContext';

export async function BundlePhase(productionContext: IProductionContext) {
  const { ctx, entries, modules } = productionContext;

  await ctx.ict.resolve();

  for (const module of modules) {
    if (module.isExecutable) {
      const transformerResult = module.transpile();
      for (const item of transformerResult.requireStatementCollection) {
        item.statement = createRuntimeRequireStatement({ ctx, item, module });
      }
      module.generate();
    }
  }

  if (modules) {
    const router = createBundleRouter({ ctx, entries });
    router.generateBundles(modules);
    if (productionContext.splitEntries.entries.length > 0) {
      router.generateSplitBundles(productionContext.splitEntries.entries);
    }
    const bundles = await router.writeBundles();
    console.log(bundles);
  }
}
