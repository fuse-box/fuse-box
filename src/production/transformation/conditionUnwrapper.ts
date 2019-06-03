import { IfStatement, SourceFile, Node } from 'ts-morph';
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

function onIfStatement(node: IfStatement, props: LocalContext) {
  const expression = node.getExpression();
  const desc = expression.getDescendants();

  if (desc.length === 3) {
    const left = extractValue(desc[0]);
    const sign = desc[1].getText();
    const right = extractValue(desc[2]);
    if (left !== undefined && right !== undefined) {
    }
    const result = computeLeftRight(left, right, sign);
    if (typeof result !== undefined) {
      if (result === true) {
        //console.log(node.getThenStatement().compilerNode);
        //console.log(node.getThenStatement().getDescendants());
        // node
        //   .getThenStatement()
        //   .getChildren()
        //   .forEach(a => {
        //     console.log(a.getText());
        //   });

        const index = node.getChildIndex();

        const parent = node.getParent();

        //parent.getChildAtIndex(index)

        const thenStatement = node.getThenStatement();
        node.replaceWithText(thenStatement.getFullText());

        //console.log(node.getThenStatement());
        //  node.replaceWithText(node.getThenStatement().getText());
        //node.replaceWithText(() => node.getThenStatement().getDescendantStatements());
      } else {
        node.replaceWithText(node.getElseStatement().getText());
      }

      //console.log(node.getElseStatement());
    }
  }
  // expression.forEachDescendant(des => {
  //   console.log(des.getText());
  // });
  //console.log(expression.getNextSibling().getText());
  //console.log(node.getText());
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
