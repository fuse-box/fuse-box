import * as ts from 'typescript';
import { IStatementReplaceableCollection } from '../analysis/fastAnalysis';
import { devImports } from '../integrity/devPackage';

export function isRequireCall(callExpression: ts.Node): callExpression is ts.CallExpression {
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
  return ts.isStringLiteralLike(args[0]);
}

export function isImportCall(callExpression: ts.Node): callExpression is ts.CallExpression {
  if (
    callExpression.kind === ts.SyntaxKind.CallExpression &&
    (<ts.CallExpression>callExpression).expression.kind === ts.SyntaxKind.ImportKeyword
  ) {
    const { arguments: args } = callExpression as ts.CallExpression;
    if (args.length !== 1) return false;
    return ts.isStringLiteralLike(args[0]);
  }
  return false;
}

export interface ITypescriptTransformProps {
  input: string;
  compilerOptions?: ts.CompilerOptions | undefined;
  replacements?: IStatementReplaceableCollection;
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
        const anyNode: any = node; // a hack to not be punished by typescript
        let str;
        let modify: (text: string) => any;
        if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
          str = anyNode.moduleSpecifier.text;
          modify = newText => (anyNode.moduleSpecifier.text = ts.createStringLiteral(newText));
        } else if (isRequireCall(node)) {
          str = anyNode.arguments[0].text;
          modify = newText => (anyNode.arguments[0] = ts.createStringLiteral(newText));
        } else if (ts.isExportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
          str = anyNode.moduleSpecifier.text;
          modify = newText => (anyNode.moduleSpecifier.text = ts.createStringLiteral(newText));
        } else if (isImportCall(node)) {
          str = anyNode.arguments[0].text;
          modify = newText => (anyNode.arguments[0] = ts.createStringLiteral(newText));
        }
        if (str && modify) {
          const replacement = props.replacements.find(item => item.fromStatement === str);
          if (replacement) {
            modify(replacement.toStatement);
          }
        }
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
