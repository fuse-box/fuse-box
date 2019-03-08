import * as ts from 'typescript';

interface ISourceFileImports {
  importDeclarations: Array<string>;
  dynamicImports: Array<string>;
  reExportDeclarations: Array<string>;
}

/**
 * Creates AST Tree
 */
export function createSourceFile(filename: string, input: string): ts.SourceFile {
  return ts.createSourceFile(filename, input, ts.ScriptTarget.Latest, true, ts.ScriptKind.Unknown);
}

export function getImports(sourceFile: ts.SourceFile): ISourceFileImports {
  const importDeclarations = [];
  const dynamicImports = [];
  const reExportDeclarations = [];

  const getFromNextNode = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
      importDeclarations.push(node.moduleSpecifier.text);
    } else if (isRequireCall(node)) {
      importDeclarations.push((<ts.StringLiteralLike>node.arguments[0]).text);
    } else if (ts.isExportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
      reExportDeclarations.push(node.moduleSpecifier.text);
    } else if (isImportCall(node)) {
      dynamicImports.push((<ts.StringLiteralLike>node.arguments[0]).text);
    }

    ts.forEachChild(node, getFromNextNode);
  };
  getFromNextNode(sourceFile);

  return {
    importDeclarations,
    dynamicImports,
    reExportDeclarations,
  };
}

export function isRequireCall(callExpression: ts.Node): callExpression is ts.CallExpression {
  if (callExpression.kind !== ts.SyntaxKind.CallExpression) return false;

  const { expression, arguments: args } = callExpression as ts.CallExpression;

  if (expression.kind !== ts.SyntaxKind.Identifier || (expression as ts.Identifier).escapedText !== 'require') {
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
