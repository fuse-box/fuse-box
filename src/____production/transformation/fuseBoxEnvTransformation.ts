import { PropertyAccessExpression, SourceFile } from 'ts-morph';
import * as ts from 'typescript';
import { Context } from '../../core/Context';

export interface IProcessTransformProps {
  ctx: Context;
  fuseBoxPath?: string;
  file: SourceFile;
}
//const TRACED_VARIABLES = ['__dirname', '__filename', 'stream', 'process', 'buffer', 'Buffer', 'http', 'https'];
function onItem(node: PropertyAccessExpression, props: LocalContext) {
  const isServer = props.ctx.config.target === 'server';
  const isBrowser = props.ctx.config.target === 'browser';
  if (node.getText() === 'FuseBox.isServer') {
    node.replaceWithText(isServer ? 'true' : 'false');
  } else if (node.getText() === 'FuseBox.isBrowser') {
    node.replaceWithText(isBrowser ? 'true' : 'false');
  } else if (node.getText() === 'FuseBox.processEnv') {
    node.replaceWithText(JSON.stringify(props.ctx.config.env));
  }
}

interface LocalContext {
  ctx: Context;
  file: SourceFile;
  fuseBoxPath?: string;
  insertions: Array<string>;
}
export function fuseBoxEnvProductionTransformation(props: IProcessTransformProps) {
  const local = { ctx: props.ctx, fuseBoxPath: props.fuseBoxPath, file: props.file, insertions: [] };
  const Identifiers = props.file.getDescendantsOfKind(ts.SyntaxKind.PropertyAccessExpression);

  // props.file.getImportStringLiterals().forEach(im => {
  //   console.log(im.getText());
  // });

  // const imports = props.file.getDescendantsOfKind(ts.SyntaxKind.ImportKeyword);
  // imports.forEach(im => {
  //   const parent = im.getParent();
  //   if (ts.isCallExpression(parent.compilerNode)) {
  //     console.log(im.getParent().getText());
  //   }
  // });
  Identifiers.forEach(id => {
    if (!id.wasForgotten()) {
      onItem(id, local);
    }
  });
  local.insertions.forEach(ins => {
    props.file.insertText(0, ins);
  });
}
