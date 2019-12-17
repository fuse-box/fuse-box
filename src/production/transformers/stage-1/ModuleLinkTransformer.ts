import { ITransformer } from '../../../compiler/program/transpileModule';
import { IVisit } from '../../../compiler/Visitor/Visitor';
import { IProductionTransformerContext } from '../interfaces';

/**
 * THis transformer should organize/emit require statements
 * We will build a dependency tree base of this
 */
export function ModuleLinkTransformer(props: IProductionTransformerContext): ITransformer {
  //const { module, ctx, productionContext } = props;
  return {
    onTopLevelTraverse: (visit: IVisit) => {},
    onEachNode: (visit: IVisit) => {
      const node = visit.node;
      if (node.type === 'ImportExpression') {
        props.onDynamicImport(node.source.value);
      }
    },
  };
}
