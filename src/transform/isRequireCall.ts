import { devImports } from '../integrity/devPackage';
import * as ts from 'typescript';

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
