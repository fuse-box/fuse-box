import { ITransformer } from '../../compiler/interfaces/ITransformer';

export function ProductionPhase_1_Init(): ITransformer {
  return {
    productionInit: props => {},
  };
}
