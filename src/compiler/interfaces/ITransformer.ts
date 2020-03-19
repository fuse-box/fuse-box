import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { IProductionContext } from '../../production/ProductionContext';
import { ISchema } from '../core/nodeSchema';
import { ISerializableTransformationContext } from '../transformer';
import { ASTNode } from './AST';
import { ImportType } from './ImportType';

export type ITransformerList = Array<ITransformerVisitors | undefined>;

export type ITranformerCallbackController = (schema: ISchema) => any;

export interface ITransformerVisitors {
  onEach?: ITranformerCallbackController;
  onProgramBody?: ITranformerCallbackController;
}

export interface IRequireStatementModuleOptions {
  breakDependantsCache?: boolean;
}
export interface ITransformerCommon {
  transformationContext: ISerializableTransformationContext;
  onRequireCallExpression?: (
    importType: ImportType,
    node: ASTNode,
    moduleOptions?: IRequireStatementModuleOptions,
  ) => void;
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
