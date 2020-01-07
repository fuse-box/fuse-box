import { ASTNode } from '../interfaces/AST';
import * as path from 'path';
export function getDynamicImport(node: ASTNode) {
  // buntis case
  if (node.type === 'ImportExpression') {
    if (node.source) return { source: node.source.value };
    return { error: 'At this moment computed statements are not supported' };
  }
  // eslint parser case
  if (node.type === 'CallExpression') {
    if (node.callee && node.callee.type === 'Import') {
      if (node.arguments.length === 1) {
        return { source: node.arguments[0].value };
      }
      return { error: 'At this moment computed statements are not supported' };
    }
  }
}

export function generateVariableFromSource(source: string, index: number) {
  let variable = path.basename(source).replace(/\.|-/g, '_') + '_' + index;
  if (!/^[a-z]/i.test(variable)) {
    variable = 'a' + variable;
  }
  return variable;
}
