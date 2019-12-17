import { ImportType } from './ImportType';
import { ASTNode } from './AST';

export interface ITransformerRequireStatement {
  importType: ImportType;
  statement: ASTNode;
  value?: string;
}
export type ITransformerRequireStatementCollection = Array<ITransformerRequireStatement>;
