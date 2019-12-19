import { Module } from '../../core/Module';
import { Context } from '../../core/Context';
import { ProductionContext } from '../ProductionContext';

export interface IProductionTransformerContext {
  module: Module;
  ctx: Context;
  productionContext: ProductionContext;
  onDynamicImport?: (source: string) => void;
}
