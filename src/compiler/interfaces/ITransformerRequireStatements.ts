import { ImportType } from './ImportType';
import { ASTNode } from './AST';

export interface ITransformerRequireStatement {
  importType: ImportType;
  statement: ASTNode;
}
export type ITransformerRequireStatementCollection = Array<ITransformerRequireStatement>;