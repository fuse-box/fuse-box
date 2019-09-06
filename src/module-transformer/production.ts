import * as ts from 'typescript';
import { isRequireCall } from '../transform/isRequireCall';
import { ITranspileStageProps, addModule2ProductionSchema } from '../production/stages/transpileStage';
import { ProductionModule } from '../production/ProductionModule';

export function moduleTransformer<T extends ts.Node>(
  props: ITranspileStageProps,
  pm: ProductionModule,
): ts.TransformerFactory<T> {
  const log = props.flow.ctx.log;
  const config = props.flow.ctx.config;
  return context => {
    // TODO: Abstract this logic out to re-use one common transformer for production and development
    const webWorkers = pm.module.fastAnalysis && pm.module.fastAnalysis.workers;
    const visit: ts.Visitor = node => {
      if (webWorkers && ts.isNewExpression(node)) {
        const newText = node.expression.getText();
        if (newText === 'Worker' || newText === 'SharedWorker') {
          if (node.arguments.length === 1) {
            const firstArg = node.arguments[0];
            const statement = firstArg['text'];
            // map item
            const item = webWorkers.find(item => {
              return item.path === statement && item.type === newText;
            });
            if (item) {
              return ts.createNew(ts.createIdentifier(newText), undefined, [ts.createStringLiteral(item.bundlePath)]);
            }
          }
        }
      }
      if (isRequireCall(node)) {
        const text = node['arguments'][0].text;

        const target = pm.findDependantModule(text);
        if (!target) {
          if (config.target !== 'electron' && config.target !== 'server') {
            if (!props.flow.ctx.config.shoudIgnorePackage(text)) {
              // if (log.props.ignoreStatementErrors && log.props.ignoreStatementErrors.includes(text)) {
              //   return;
              // }
              log.error('Problem when resolving require "$text" in $file', {
                text: text,
                file: pm.module.getShortPath(),
              });
            }
          }
        } else {
          // log.info(
          //   target.module.isExecutable() ? 'Transpile' : 'Register',
          //   `"${text}" from ${pm.module.getShortPath()} to ${target.module.getShortPath()}`,
          // );

          log.info(target.module.isExecutable() ? 'Transpile' : 'Register', target.module.getShortPath());

          addModule2ProductionSchema(props, target);
          return ts.createCall(
            ts.createPropertyAccess(ts.createIdentifier('$fsx'), ts.createIdentifier('r')),
            undefined,
            [ts.createNumericLiteral(target.getId().toString())],
          );
        }
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}
