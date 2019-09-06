import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import * as ts from 'typescript';
import { fixModuleSourceMap } from '../../sourcemaps/helpers';
import { moduleTransformer } from '../../module-transformer/production';
import { tsTransformModule } from '../../transform/tsTransformModule';

export interface ITranspileStageProps {
  flow: IProductionFlow;
  amount: number;
}

export function addModule2ProductionSchema(props: ITranspileStageProps, pm: ProductionModule) {
  const schema = props.flow.productionContext.schema;
  if (schema.indexOf(pm) > -1) {
    return;
  }
  schema.push(pm);
  if (pm.module.isExecutable()) {
    props.amount++;
    transpileProductionModule(props, pm);
  }
}

function transpileProductionModule(props: ITranspileStageProps, prodModule: ProductionModule) {
  const text = prodModule.getSourceText();
  const ctx = props.flow.ctx;
  const compilerOptions: ts.CompilerOptions = {
    ...ctx.tsConfig.compilerOptions,
  };
  const requireSourceMaps = prodModule.module.isSourceMapRequired();
  if (requireSourceMaps) {
    compilerOptions.sourceMap = true;
    compilerOptions.inlineSources = true;
  }

  const result = tsTransformModule(
    text,
    prodModule.module.props.absPath,
    compilerOptions,
    [],
    [moduleTransformer(props, prodModule)],
    ctx.customTransformers,
  );

  prodModule.transpiledSourceMap = requireSourceMaps
    ? fixModuleSourceMap(prodModule.module, result.sourceMapText)
    : undefined;

  prodModule.transpiledContent = result.outputText;
}

export function transpileStage(props: IProductionFlow) {
  const { productionContext } = props;

  const log = props.ctx.log;

  log.info('Transpile stage', '<dim><bold>- Transpile stage</bold></dim>');
  const opts: ITranspileStageProps = {
    flow: props,
    amount: 0,
  };

  const modules = productionContext.getProjectEntries();

  modules.forEach(mod => addModule2ProductionSchema(opts, mod.productionModule));

  log.info('Transpile stage', '<green><bold>$checkmark $amount Modules have been transpiled</bold></green>', {
    amount: opts.amount,
  });
}
