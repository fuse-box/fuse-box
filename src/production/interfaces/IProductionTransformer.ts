import { ITransformerSharedOptions } from '../../compiler/interfaces/ITransformerSharedOptions';
import { ProductionContext } from '../ProductionContext';
import { Module } from '../../core/Module';

export interface IProductionTransformer extends ITransformerSharedOptions {
  productionContext: ProductionContext;
  module?: Module;
}
