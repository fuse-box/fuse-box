import * as ts from 'typescript';
import { IStatementReplaceableCollection, IWebWorkerItem } from '../analysis/fastAnalysis';
import { devImports } from '../integrity/devPackage';

export function isRequireCall(callExpression: ts.Node) {
  if (callExpression.kind !== ts.SyntaxKind.CallExpression) return false;
  const { expression, arguments: args } = callExpression as ts.CallExpression;
  if (expression.kind !== ts.SyntaxKind.Identifier) {
    return false;
  }
  const text = (expression as ts.Identifier).escapedText as string;
  if (!['require', devImports.variable].includes(text)) {
    return false;
  }
  if (args.length !== 1) return false;
  if (ts.isStringLiteralLike(args[0])) {
    return true;
  }
}

export interface ITypescriptTransformProps extends ts.TranspileOptions {
  input: string;
  webWorkers?: Array<IWebWorkerItem>;
  replacements?: IStatementReplaceableCollection;
}

export function visitStatementNode(node, replacer: (input) => any) {
  if (isRequireCall(node)) {
    const replacement = replacer(node.arguments[0].text);
    if (replacement) {
      node.arguments[0] = ts.createStringLiteral(replacement);
    }
  }
}
export function tsTransform(props: ITypescriptTransformProps): ts.TranspileOutput {

  function moduleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return context => {
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
                  return ts.createNew(ts.createIdentifier(newText), undefined, [
                    ts.createStringLiteral(item.bundlePath),
                  ]);
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

  const after = [];

  if (props.replacements || props.webWorkers) {
    after.push(moduleTransformer());
  }

  return ts.transpileModule(props.input, {
    fileName: props.fileName,
    compilerOptions: props.compilerOptions,
    transformers: {

      // merge in any custom transformers (user-provided)
      ...props.transformers,

      // 2nd-level merge in transformers
      after: [

        // make sure core transformers are applied and executed first
        ...after,

        // user-provided transformers
        ...props.transformers.after,
      ]
    },
  });
}
