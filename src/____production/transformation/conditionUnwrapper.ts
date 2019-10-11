import { IfStatement, SourceFile, Node, Statement } from 'ts-morph';
import * as ts from 'typescript';
import { Context } from '../../core/Context';

export interface IProcessTransformProps {
  ctx: Context;
  fuseBoxPath?: string;
  file: SourceFile;
}

function extractValue(node: Node) {
  let value;
  let text = node.getText();

  if (ts.isStringLiteral(node.compilerNode)) {
    value = node.compilerNode.text;
  } else if (ts.isNumericLiteral(node.compilerNode)) {
    value = parseInt(node.compilerNode.text);
  } else {
    if (text === 'true') {
      value = true;
    } else if (text === 'false') {
      value = false;
    }
  }
  return value;
}

function computeLeftRight(left, right, sign) {
  switch (sign) {
    case '!=':
      return left != right;
    case '!==':
      return left !== right;
    case '===':
      return left === right;
    case '==':
      return left === right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    case '<':
      return left < right;
    case '<=':
      return left <= right;
  }
}
function getStatementText(node: Statement) {
  const syntaxList = node.getChildSyntaxList();
  if (syntaxList) {
    return syntaxList.getText({ trimLeadingIndentation: true });
  } else if (node.compilerNode['expression']) {
    return node.compilerNode['expression'].getText();
  }
  return node.getText();
}

function setResult(result: any, node: IfStatement) {
  if (result) {
    node.replaceWithText(getStatementText(node.getThenStatement()));
  } else {
    const elseStatement = node.getElseStatement();
    if (elseStatement) {
      node.replaceWithText(getStatementText(node.getElseStatement()));
    } else {
      node.remove();
    }
  }
}
function onIfStatement(node: IfStatement, props: LocalContext) {
  const expression = node.getExpression();
  const desc = expression.getDescendants();

  if (desc.length === 3) {
    const left = extractValue(desc[0]);

    const sign = desc[1].getText();
    const right = extractValue(desc[2]);
    if (left !== undefined && right !== undefined) {
      const result = computeLeftRight(left, right, sign);
      if (typeof result !== undefined) {
        setResult(result, node);
      }
    }
  } else {
    const children = expression.getChildren();
    if (children.length === 2) {
      const sign = children[0].getText();
      const value = children[1].getText();
      if (sign === '!' && (value === 'true' || value === 'false')) {
        const bool = value === 'true' ? true : false;
        setResult(!bool, node);
      }
    } else {
      const text = expression.getText();
      if (text === 'true') {
        setResult(true, node);
      }
      if (text === 'false') {
        setResult(false, node);
      }
    }
  }
}

interface LocalContext {
  ctx: Context;
  file: SourceFile;
  fuseBoxPath?: string;
  insertions: Array<string>;
}
export function conditionUnwrapperProduction(props: IProcessTransformProps) {
  const local = { ctx: props.ctx, fuseBoxPath: props.fuseBoxPath, file: props.file, insertions: [] };
  const Identifiers = props.file.getDescendantsOfKind(ts.SyntaxKind.IfStatement);
  Identifiers.forEach(id => {
    if (!id.wasForgotten()) {
      onIfStatement(id, local);
    }
  });
  local.insertions.forEach(ins => {
    props.file.insertText(0, ins);
  });
}
