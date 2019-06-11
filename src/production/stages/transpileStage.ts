import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import * as ts from 'typescript';
import { isRequireCall } from '../../transform/tsTransform';

export function visitStatementNode(node, replacer: (input) => any) {
  if (isRequireCall(node)) {
    const replacement = replacer(node.arguments[0].text);
    if (replacement) {
      node.arguments[0] = ts.createStringLiteral(replacement);
    }
  }
}

function moduleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return context => {
    const visit: ts.Visitor = node => {
      if (isRequireCall(node)) {
        return ts.createExpressionStatement(
          ts.createCall(ts.createPropertyAccess(ts.createIdentifier('$fsx'), ts.createIdentifier('r')), undefined, [
            ts.createNumericLiteral('0'),
          ]),
        );
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}

function transpileProductionModule(props: IProductionFlow, module: ProductionModule) {
  const text = module.getSourceText();
  ts.transpileModule(text, {
    fileName: module.module.props.absPath,
    compilerOptions: props.ctx.tsConfig.compilerOptions,
    transformers: { after: [moduleTransformer()] },
  });
}
export function transpileStage(props: IProductionFlow) {
  const { productionContext, ctx, packages } = props;

  const log = props.ctx.log;

  log.progress('<yellow><bold>- Transpile stage</bold></yellow>');
  let amount = 0;
  productionContext.productionPackages.forEach(pp => {
    pp.productionModules.forEach(pm => {
      amount++;
      if (pm.module.isExecutable()) {
        log.progress('<yellow><bold>- Transpile module $name</bold></yellow>', { name: pm.module.getShortPath() });
        transpileProductionModule(props, pm);
      }
    });
  });

  log.progressEnd('<green><bold>$checkmark $amount Modules have been transpiled</bold></green>', {
    amount,
  });
}
