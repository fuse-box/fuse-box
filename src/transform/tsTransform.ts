import * as ts from 'typescript';
import { IStatementReplaceableCollection, IWebWorkerItem } from '../analysis/fastAnalysis';
import { moduleTransformer } from '../module-transformer/development';

export interface ITypescriptTransformProps extends ts.TranspileOptions {
  input: string;
  webWorkers?: Array<IWebWorkerItem>;
  replacements?: IStatementReplaceableCollection;
}

export function tsTransform(props: ITypescriptTransformProps): ts.TranspileOutput {
  const after = [];

  if (props.replacements || props.webWorkers) {
    after.push(moduleTransformer(props));
  }

  if (!props.transformers) {
    props.transformers = {};
  }

  return ts.transpileModule(props.input, {
    fileName: props.fileName,
    compilerOptions: props.compilerOptions,
    transformers: {
      before: props.transformers.before || [],
      after: [].concat(after, props.transformers.after || []),
      afterDeclarations: props.transformers.afterDeclarations || [],
    },
  });
}
