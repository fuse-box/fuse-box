import { SourceFile } from 'ts-morph';
import { Context } from '../../core/Context';
import { processProductionTransformation } from './processTransformation';
import { browserProductionPolyfillTransformation } from './browserPolyfillTransformation';
import { fuseBoxEnvProductionTransformation } from './fuseBoxEnvTransformation';

export interface IPerformStaticTransformations {
  ctx: Context;
  fuseBoxPath: string;
  file: SourceFile;
}
export function performStaticTransformations(props: IPerformStaticTransformations) {
  processProductionTransformation(props);
  browserProductionPolyfillTransformation(props);
  fuseBoxEnvProductionTransformation(props);
}
