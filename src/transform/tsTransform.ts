import * as ts from 'typescript';
import { IStatementReplaceableCollection, IWebWorkerItem } from '../analysis/fastAnalysis';
import { moduleTransformer } from '../module-transformer/development';
import { tsTransformModule } from './tsTransformModule';

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
  return tsTransformModule(props.input, props.fileName, props.compilerOptions, [], after, props.transformers);
}
