import * as ts from 'typescript';
import { isRequireCall } from '../transform/isRequireCall';
import { ITypescriptTransformProps } from '../transform/tsTransform';

export function visitStatementNode(node, replacer: (input) => any) {
  if (isRequireCall(node)) {
    const replacement = replacer(node.arguments[0].text);
    if (replacement) {
      node.arguments[0] = ts.createStringLiteral(replacement);
    }
  }
}

export function moduleTransformer<T extends ts.Node>(props: ITypescriptTransformProps): ts.TransformerFactory<T> {
  return context => {
    // TODO: Abstract this logic out to re-use one common transformer for production and development
    const visit: ts.Visitor = node => {
      if (props.webWorkers) {
        if (ts.isNewExpression(node)) {
          const newText = node.expression.getText();
          if (newText === 'Worker' || newText === 'SharedWorker') {
            if (node.arguments.length === 1) {
              const firstArg = node.arguments[0];
              const statement = firstArg['text'];
              // map item
              const item = props.webWorkers.find(item => {
                return item.path === statement && item.type === newText;
              });
              if (item) {
                return ts.createNew(ts.createIdentifier(newText), undefined, [ts.createStringLiteral(item.bundlePath)]);
              }
            }
          }
        }
      } else {
        visitStatementNode(node, statement => {
          const replacement = props.replacements.find(item => item.fromStatement === statement);
          if (replacement) {
            return replacement.toStatement;
          }
        });
      }

      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}
