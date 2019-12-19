import { ASTNode } from '../../../compiler/interfaces/AST';
import { createGlobalContext } from '../../../compiler/program/GlobalContext';
import { transpileModule } from '../../../compiler/program/transpileModule';
import { Context } from '../../../core/Context';
import { Package } from '../../../core/Package';
import { ModuleLinkTransformer } from './ModuleLinkTransformer';
import { IProductionTransformerContext } from '../interfaces';
import { Module } from '../../../core/Module';

function codeSplitting(props: { ctx: Context; splitEntry: Module }) {
  const submodules: Array<Module> = [];
  const { ctx, splitEntry } = props;

  // trace the file's origing
  // it should match the split entry
  function traceOrigin(target: Module) {
    let traced = false;
    for (const dependant of target.productionDependants) {
      if (dependant === splitEntry) traced = true;
      else {
        traced = traceOrigin(dependant);
        if (!traced) return;
      }
    }
    return traced;
  }

  // go through dependencies and try tracing down the origin
  function traceDepedencies(target: Module) {
    for (const dependency of target.productionDependencies) {
      if (traceOrigin(dependency)) {
        submodules.push(dependency);
        traceDepedencies(dependency);
      }
    }
  }
  traceDepedencies(splitEntry);

  console.log('Split data');
  console.log('--------->>>');
  submodules.forEach(item => {
    console.log(item.getShortPath());
  });
  console.log('----');
}
export function launchFirstStage(ctx: Context, packages: Array<Package>) {
  const productionContext = ctx.productionContext;

  const splitEntries = [];
  packages.forEach(pkg => {
    pkg.modules.forEach(module => {
      // store dependencies and dependants
      const refs = module.moduleSourceRefs;
      for (const sourceValue in module.moduleSourceRefs) {
        const targetModule = refs[sourceValue];
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
            if (refs[source]) {
              splitEntries.push(refs[source]);
            }
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

  for (const splitEntry of splitEntries) {
    codeSplitting({ ctx, splitEntry });
  }
}
