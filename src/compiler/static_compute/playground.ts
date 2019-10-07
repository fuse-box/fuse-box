import * as buntis from 'buntis';
import { ASTNode } from '../interfaces/AST';
import { computeBinaryExpression } from './computeBinaryExpression';

function getAst(expression: string): ASTNode {
  const ast = buntis.parseTSModule(expression, {
    directives: true,
    jsx: true,
    next: true,
    loc: true,
    ts: true,
  });
  return ast.body[0]['expression'];
}
computeBinaryExpression(getAst('1+2*2'));
