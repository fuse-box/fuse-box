import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { IProductionContext } from '../../production/ProductionContext';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';
import { ASTNode } from './AST';
import { ImportType } from './ImportType';

export type ITranformerCallback = (visit: IVisit) => IVisitorMod | void | undefined;

export interface ITransformerVisitors {
  onTopLevelTraverse?: ITranformerCallback;
  onEachNode?: ITranformerCallback;
}

export interface ITransformerCommon {
  ctx: Context;
  module: Module;
  onRequireCallExpression?: (importType: ImportType, node: ASTNode) => void;
}

export interface ITransformerProduction {
  ctx: Context;
  module: Module;
  productionContext: IProductionContext;
}

export interface ITransformer {
  target?: {
    type?: 'ts' | 'js' | 'js_ts';
    test?: RegExp;
  };
  commonVisitors?: (props: ITransformerCommon) => ITransformerVisitors;

  productionWarmupPhase?: (props: ITransformerProduction) => ITransformerVisitors;
}
