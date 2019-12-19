import { ITransformer } from '../../compiler/interfaces/ITransformer';
import * as buntis from 'buntis';
import { GlobalContextTransformer } from '../../compiler/transformers/GlobalContextTransformer';
import { transpileModule } from '../../compiler/program/transpileModule';
import { createGlobalContext } from '../../compiler/program/GlobalContext';
import { createContext } from '../../core/Context';
import { createPackage } from '../../core/Package';
import { createModule } from '../../core/Module';
import { ASTNode } from '../../compiler/interfaces/AST';
import { ProductionContext } from '../ProductionContext';
import { ModuleTree } from '../module/ModuleTree';

export function testProductionWarmup(props: {
  jsx?: boolean;
  code: string;
  transformers: Array<ITransformer>;
  props?: any;
}) {
  const ctx = createContext({
    cache: false,
    devServer: false,
    target: 'browser',
  });

  const pkg = createPackage({ ctx: ctx, meta: {} as any });
  const module = createModule(
    {
      absPath: __filename,
      ctx: ctx,
      extension: '.ts',
      fuseBoxPath: 'file.ts',
    },
    pkg,
  );
  pkg.modules.push(module);

  module.contents = props.code;
  module.parse();

  const productionContext = ProductionContext(ctx, [pkg]);

  const tree = (module.moduleTree = ModuleTree(productionContext, module));

  const tranformers = [GlobalContextTransformer().commonVisitors(props.props)];
  for (const t of props.transformers) {
    if (t.productionWarmupPhase) {
      tranformers.push(t.productionWarmupPhase({ ctx: ctx, module: module, productionContext: productionContext }));
    }
  }
  transpileModule({
    ast: module.ast as ASTNode,
    globalContext: createGlobalContext(),
    transformers: tranformers,
  });
  return { productionContext, module, tree };
}
