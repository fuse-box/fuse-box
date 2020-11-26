import { createBuild } from '../../core/build';
import { IModule } from '../../moduleResolver/module';
import { moduleCompiler } from '../../threading/compile/moduleCompiler';
import { IProductionContext } from '../ProductionContext';

export async function BundlePhase(productionContext: IProductionContext) {
  const { ctx, entries, modules } = productionContext;

  function compile(module: IModule): Promise<void> {
    return new Promise((resolve, reject) => {
      moduleCompiler({
        ast: module.ast,
        context: module.getTransformationContext(),
        generateCode: true,
        onFatal: reject,
        onError: message => {
          module.errored = true;
          ctx.log.warn(message);
        },
        onReady: response => {
          module.contents = response.contents;
          module.sourceMap = response.sourceMap;

          if (ctx.config.productionBuildTarget) {
            ctx.log.info('downTranspile', module.publicPath);
            module.transpileDown(ctx.config.productionBuildTarget);
          }
          return resolve();
        },
        onResolve: async data => {
          if (module.moduleSourceRefs[data.source]) {
            return { id: module.moduleSourceRefs[data.source].id };
          }
          return {};
        },
      });
    });
  }

  const promises = [];

  for (const module of modules) {
    if (module.isExecutable) {
      productionContext.log.info('generate', module.publicPath);
      promises.push(compile(module));
    } else {
      productionContext.log.info('add', module.publicPath);
    }
  }

  await Promise.all(promises);

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
