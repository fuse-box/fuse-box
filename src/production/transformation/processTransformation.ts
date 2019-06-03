import { SourceFile, Node, Identifier } from 'ts-morph';
import * as ts from 'typescript';
import { Context } from '../../core/Context';

export interface IProcessTransformProps {
  ctx: Context;
  file: SourceFile;
}
function onProcess(node: Identifier, props: LocalContext) {
  const parent = node.getParent();
  const isDefinedLocally = node.findReferences().length > 0;

  if (isDefinedLocally) {
    return;
  }

  if (ts.isPropertyAccessExpression(parent.compilerNode)) {
    // is a part of other expression
    if (parent.compilerNode.expression.getText() !== 'process') {
      return;
    }

    const secondProperty = parent.compilerNode.name.getText();
    const main = parent.getParent().compilerNode;
    if (secondProperty && ts.isPropertyAccessExpression(main)) {
      const third = main.name.getText();
      if (secondProperty === 'env' && third) {
        if (props.ctx.config.env[third] !== undefined) {
          parent.getParent().replaceWithText(JSON.stringify(props.ctx.config.env[third]));
        } else {
          parent.getParent().replaceWithText('undefined');
        }
      }
    } else {
      // deal with 2 properties
      if (secondProperty) {
        if (secondProperty === 'version') {
          parent.replaceWithText("'1.0.0'");
        } else if (secondProperty === 'versions') {
          parent.replaceWithText('{}');
        } else if (secondProperty === 'title') {
          parent.replaceWithText("'browser'");
        } else if (secondProperty === 'umask') {
          parent.getParent().replaceWithText('0');
        } else if (secondProperty === 'browser') {
          parent.replaceWithText('true');
        } else if (secondProperty === 'versions') {
          parent.replaceWithText('{}');
        } else if (secondProperty === 'cwd') {
          parent.getParent().replaceWithText("'/'");
        } else if (secondProperty === 'env') {
          parent.replaceWithText('__env');
          props.insertions.push(`const __env = ${JSON.stringify(props.ctx.config.env)};`);
        } else {
          // otherwise add process to the dependenices
          props.insertions.push(`const process = require("process");`);
        }
      }
    }
  }
}

interface LocalContext {
  ctx: Context;
  file: SourceFile;
  insertions: Array<string>;
}
export function processProductionTransformation(props: IProcessTransformProps) {
  if (props.ctx.config.target !== 'browser') {
    return;
  }
  const local = { ctx: props.ctx, file: props.file, insertions: [] };
  const Identifiers = props.file.getDescendantsOfKind(ts.SyntaxKind.Identifier);
  Identifiers.forEach(id => {
    if (!id.wasForgotten()) {
      if (id.getText() === 'process') {
        onProcess(id, local);
      }
    }
  });
  local.insertions.forEach(ins => {
    props.file.insertText(0, ins);
  });
}
