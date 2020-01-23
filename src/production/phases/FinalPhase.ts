import { BundleRouter } from '../../bundle/bundleRouter';
import { createRuntimeRequireStatement } from '../../moduleResolver/ModuleResolver';
import { IProductionContext } from '../ProductionContext';

/**
 * @todo:
 * - fix bundle router to understand splitEntry
 */
export async function FinalPhase(productionContext: IProductionContext) {
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
    const router = BundleRouter({ ctx, entries });
    router.dispatchModules(modules, productionContext);
    /**
     * @todo
     * look into bundle_dev.ts
     */
    // const bundles = await router.writeBundles();
    await router.writeBundles();
    // console.log(bundles);
  }
}
