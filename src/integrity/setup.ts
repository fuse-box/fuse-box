import { Context } from '../core/__Context';
import { assembleFastAnalysis } from './assembleFastAnalysis';
import { assembleNodeModule } from './assembleNodeModule';

export function attachEssentials(ctx: Context) {
  assembleFastAnalysis(ctx);
  //assembleNodeModule(ctx);
}
