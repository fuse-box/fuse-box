import { ImportType } from './ImportType';
import { ASTNode } from './AST';

export interface ITransformerSharedOptions {
  onRequireCallExpression?: (importType: ImportType, node: ASTNode, value?: string) => void;
}
