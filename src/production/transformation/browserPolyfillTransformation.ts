import { SourceFile, Node, Identifier } from 'ts-morph';
import * as ts from 'typescript';
import { Context } from '../../core/Context';
import * as path from 'path';

export interface IProcessTransformProps {
  ctx: Context;
  fuseBoxPath?: string;
  file: SourceFile;
}
//const TRACED_VARIABLES = ['__dirname', '__filename', 'stream', 'process', 'buffer', 'Buffer', 'http', 'https'];
function onItem(node: Identifier, props: LocalContext) {
  const parent = node.getParent();
  const isDefinedLocally = node.findReferences().length > 0;

  if (isDefinedLocally) {
    return;
  }
  if (ts.isPropertyAccessExpression(parent.compilerNode)) {
    return;
  }
  switch (node.getText()) {
    case '__dirname':
      node.replaceWithText(`"${path.dirname(props.fuseBoxPath)}"`);
      break;
    case '__filename':
      node.replaceWithText(`"${props.fuseBoxPath}"`);
      break;
    case 'stream':
      props.insertions.push('import * as stream from "stream";\n');
      break;
    case 'buffer':
      props.insertions.push('import { Buffer as buffer } from "buffer";\n');
      break;
    case 'Buffer':
      props.insertions.push('import { Buffer } from "buffer";\n');
      break;
    case 'http':
      props.insertions.push('import * as http from "http";\n');
      break;
    case 'https':
      props.insertions.push('import * as https from "https";\n');
      break;
    default:
      break;
  }
}

interface LocalContext {
  ctx: Context;
  file: SourceFile;
  fuseBoxPath?: string;
  insertions: Array<string>;
}
export function browserProductionPolyfillTransformation(props: IProcessTransformProps) {
  if (props.ctx.config.target !== 'browser') {
    return;
  }
  const local = { ctx: props.ctx, fuseBoxPath: props.fuseBoxPath, file: props.file, insertions: [] };
  const Identifiers = props.file.getDescendantsOfKind(ts.SyntaxKind.Identifier);
  Identifiers.forEach(id => {
    if (!id.wasForgotten()) {
      onItem(id, local);
    }
  });
  local.insertions.forEach(ins => {
    props.file.insertText(0, ins);
  });
}
