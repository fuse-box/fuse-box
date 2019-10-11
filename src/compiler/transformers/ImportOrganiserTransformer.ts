import { ASTNode } from '../interfaces/AST';
import { GlobalContext } from '../program/GlobalContext';
import { ITransformer } from '../program/transpileModule';
import { createMemberExpression, isLocalIdentifier } from '../Visitor/helpers';
import { IVisit } from '../Visitor/Visitor';

/**
 * THis transformer should organize/emit require statements
 * We will build a dependency tree base of this
 */
export function ImportOrganiserTransformer(): ITransformer {
  return {
    onTopLevelTraverse: (visit: IVisit) => {},
    onEachNode: visit => {},
  };
}
