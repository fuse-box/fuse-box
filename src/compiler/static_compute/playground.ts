import { ASTNode } from '../interfaces/AST';
import { parseTypeScript } from '../parser';
import { computeBinaryExpression } from './computeBinaryExpression';

function getAst(expression: string): ASTNode {
  const ast = parseTypeScript(expression);
  return ast.body[0]['expression'];
}
computeBinaryExpression(getAst('1+2*2'));
