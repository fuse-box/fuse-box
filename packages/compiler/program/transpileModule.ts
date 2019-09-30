import { ASTNode } from '../interfaces/AST';
import { ICompilerOptions } from '../interfaces/ICompilerOptions';
import { FastVisit, IVisit, IVisitorMod, TopLevelVisit } from '../Visitor/Visitor';

export type ITranformerCallback = (visit: IVisit) => IVisitorMod | void | undefined;
export type ITransformer =
  | ITranformerCallback
  | {
      onTopLevelTraverse?: ITranformerCallback;
      onEachNode?: ITranformerCallback;
    };

export type ITransformerList = Array<ITransformer>;
export interface IProgramProps {
  ast: ASTNode;
  globalContext?: any;
  namespace?: string;
  transformers: ITransformerList;
  compilerOptions?: ICompilerOptions;
}

export function transpileModule(props: IProgramProps) {
  const eachNodeTransformers: Array<ITranformerCallback> = [];
  const onTopLevelTransformers: Array<ITranformerCallback> = [];
  //console.log(JSON.stringify(props.ast, null, 2));
  for (const t of props.transformers) {
    if (typeof t === 'object') {
      if (t.onEachNode) eachNodeTransformers.push(t.onEachNode);
      if (t.onTopLevelTraverse) onTopLevelTransformers.push(t.onTopLevelTraverse);
    } else {
      eachNodeTransformers.push(t);
    }
  }

  props.globalContext.programProps = props;
  if (onTopLevelTransformers.length) {
    TopLevelVisit({
      ast: props.ast,
      globalContext: props.globalContext,
      fn: visit => {
        for (const onTopLevelCallback of onTopLevelTransformers) {
          let response = onTopLevelCallback(visit);
          if (response) return response;
        }
      },
    });
  }
  FastVisit({
    ast: props.ast,
    globalContext: props.globalContext,
    fn: visit => {
      for (const eachNodeCallback of eachNodeTransformers) {
        let response = eachNodeCallback(visit);
        if (response) return response;
      }
    },
  });
  if (props.globalContext.completeCallbacks.length) {
    for (const cb of props.globalContext.completeCallbacks) {
      cb();
    }
  }
}
