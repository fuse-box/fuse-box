import { ASTNode } from '../interfaces/AST';
import { ITranformerCallbackController, ITransformerList } from '../interfaces/ITransformer';
import { nodeVisitor } from './nodeVisitor';
import { ISharedContextOverrides } from './sharedContext';

export interface ITransformModuleProps {
  contextOverrides?: ISharedContextOverrides;
  root: ASTNode;
  transformers: ITransformerList;
}

export function transformModule(props: ITransformModuleProps) {
  const eachNodeTransformers: Array<ITranformerCallbackController> = [];
  const eachProgamBodyTransformers: Array<ITranformerCallbackController> = [];

  //console.log(JSON.stringify(props.ast, null, 2));
  for (const t of props.transformers) {
    if (t) {
      if (typeof t === 'object') {
        if (t.onEach) eachNodeTransformers.push(t.onEach);
        if (t.onProgramBody) eachProgamBodyTransformers.push(t.onProgramBody);
      } else {
        eachNodeTransformers.push(t);
      }
    }
  }

  nodeVisitor({
    ast: props.root,
    contextOverrides: props.contextOverrides,
    visitorProps: props,
    fn: scope => {
      for (const transformer of eachNodeTransformers) {
        if (transformer(scope)) return;
      }
    },
    programBodyFn: scope => {
      for (const transformer of eachProgamBodyTransformers) {
        if (transformer(scope)) return;
      }
    },
  });
}
