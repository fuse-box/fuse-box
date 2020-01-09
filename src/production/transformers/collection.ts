import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { Phase_1_ExportLink } from './WarmupPhase_Export';
import { Phase_1_ImportLink } from './WarmupPhase_Import';

export const PRODUCTION_TRANSFORMERS: Array<ITransformer> = [Phase_1_ImportLink(), Phase_1_ExportLink()];
