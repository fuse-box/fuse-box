import { ITransformer } from '../../compiler/interfaces/ITransformer';
import { Phase_1_ExportLink } from './Phase_1_ExportLink';
import { Phase_1_ImportLink } from './Phase_1_ImportLink';

export const PRODUCTION_TRANSFORMERS: Array<ITransformer> = [Phase_1_ImportLink(), Phase_1_ExportLink()];
