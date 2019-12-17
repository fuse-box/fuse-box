import { ASTNode } from '../../../compiler/interfaces/AST';
import { createGlobalContext } from '../../../compiler/program/GlobalContext';
import { transpileModule } from '../../../compiler/program/transpileModule';
import { Context } from '../../../core/Context';
import { Package } from '../../../core/Package';
import { ModuleLinkTransformer } from './ModuleLinkTransformer';
import { IProductionTransformerContext } from '../interfaces';

export function launchFirstStage(ctx: Context, packages: Array<Package>) {
  const productionContext = ctx.productionContext;
  packages.forEach(pkg => {
    pkg.modules.forEach(module => {
      // store dependencies and dependants
      for (const sourceValue in module.moduleSourceRefs) {
        const targetModule = module.moduleSourceRefs[sourceValue];
        if (targetModule.productionDependants.indexOf(module) === -1) {
          targetModule.productionDependants.push(module);
        }
        if (module.productionDependencies.indexOf(targetModule) === -1) {
          module.productionDependencies.push(targetModule);
        }
      }

      // reset the AST here
      if (module.isExecutable()) {
        ctx.log.info('stage-1', '<dim>Reset AST for $file</dim>', { file: module.getShortPath() });
        module.parse();
        const transformerProps: IProductionTransformerContext = {
          ctx,
          module,
          productionContext,
          onDynamicImport: (source: string) => {
            // need to remove the from the dependencies, check the origin and create
            // a different bundle
          },
        };
        transpileModule({
          ast: module.ast as ASTNode,
          globalContext: createGlobalContext({}),
          transformers: [ModuleLinkTransformer(transformerProps)],
        });
      }
    });
  });
}
