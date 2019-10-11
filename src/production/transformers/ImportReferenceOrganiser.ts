import { ITransformer } from '../../compiler/program/transpileModule';
import { IVisit } from '../../compiler/Visitor/Visitor';
import { IProductionTransformer } from '../interfaces/IProductionTransformer';

/**
 * THis transformer should organize/emit require statements
 * We will build a dependency tree base of this
 */
export function ImportReferenceOrganiser(props: IProductionTransformer): ITransformer {
  return {
    onTopLevelTraverse: (visit: IVisit) => {},
    onEachNode: visit => {},
  };
}
