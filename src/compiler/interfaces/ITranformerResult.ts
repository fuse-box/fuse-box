import { ASTNode } from './AST';
import { ITransformerRequireStatementCollection } from './ITransformerRequireStatements';

export interface ITransformerResult {
  ast?: ASTNode;
  requireStatementCollection: ITransformerRequireStatementCollection;
}
