import { ICompilerOptions } from '../../compilerOptions/interfaces';
import { Context } from '../../core/Context';
import { IModule } from '../../moduleResolver/Module';
import { IProductionContext } from '../../production/ProductionContext';
import { IVisit, IVisitorMod } from '../Visitor/Visitor';
import { ASTNode } from './AST';
import { ImportType } from './ImportType';

export type ITranformerCallback = (visit: IVisit) => undefined | IVisitorMod | void;

export interface ITransformerVisitors {
  onEachNode?: ITranformerCallback;
  onTopLevelTraverse?: ITranformerCallback;
}

export interface ITransformerCommon {
  compilerOptions: ICompilerOptions;
  ctx: Context;
  module: IModule;
  onRequireCallExpression?: (importType: ImportType, node: ASTNode) => void;
}

export interface ITransformerProduction {
  ctx: Context;
  module: IModule;
  productionContext: IProductionContext;
}

export interface ITransformer {
  target?: {
    test?: RegExp;
    type?: 'js' | 'js_ts' | 'ts';
  };
  commonVisitors?: (props?: ITransformerCommon) => ITransformerVisitors;
  productionWarmupPhase?: (props?: ITransformerProduction) => ITransformerVisitors;
}
