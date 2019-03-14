import * as ts from 'typescript';
import { IStatementReplaceableCollection } from '../analysis/fastAnalysis';
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

export interface ITypescriptTransformProps {
  input: string;
  compilerOptions?: ts.CompilerOptions | undefined;
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
  let compilerOptions: ts.CompilerOptions = props.compilerOptions || {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ESNext,
    jsx: ts.JsxEmit.React,
    importHelpers: true,
    sourceMap: true,
    inlineSources: true,
    experimentalDecorators: true,
    jsxFactory: 'react',
  };

  function moduleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return context => {
      const visit: ts.Visitor = node => {
        visitStatementNode(node, statement => {
          const replacement = props.replacements.find(item => item.fromStatement === statement);
          if (replacement) {
            return replacement.toStatement;
          }
        });
        return ts.visitEachChild(node, child => visit(child), context);
      };

      return node => ts.visitNode(node, visit);
    };
  }
  return ts.transpileModule(props.input, {
    compilerOptions: compilerOptions,
    transformers: { after: [props.replacements && moduleTransformer()] },
  });
}
