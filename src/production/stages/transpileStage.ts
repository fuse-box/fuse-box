import { IProductionFlow } from '../main';
import { ProductionModule } from '../ProductionModule';
import * as ts from 'typescript';
import { isRequireCall } from '../../transform/tsTransform';
import { fixModuleSourceMap } from '../../sourcemaps/helpers';

interface ITranspileStageProps {
  flow: IProductionFlow;
  amount: number;
}

function addModule2ProductionSchema(props: ITranspileStageProps, pm: ProductionModule) {
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

function moduleTransformer<T extends ts.Node>(
  props: ITranspileStageProps,
  pm: ProductionModule,
): ts.TransformerFactory<T> {
  const log = props.flow.ctx.log;
  const config = props.flow.ctx.config;
  return context => {
    const webWorkers = pm.module.fastAnalysis && pm.module.fastAnalysis.workers;
    const visit: ts.Visitor = node => {
      if (webWorkers && ts.isNewExpression(node)) {
        const newText = node.expression.getText();
        if (newText === 'Worker' || newText === 'SharedWorker') {
          if (node.arguments.length === 1) {
            const firstArg = node.arguments[0];
            const statement = firstArg['text'];
            // map item
            const item = webWorkers.find(item => {
              return item.path === statement && item.type === newText;
            });
            if (item) {
              return ts.createNew(ts.createIdentifier(newText), undefined, [ts.createStringLiteral(item.bundlePath)]);
            }
          }
        }
      }
      if (isRequireCall(node)) {
        const text = node['arguments'][0].text;

        const target = pm.findDependantModule(text);
        if (!target) {
          if (config.target !== 'electron' && config.target !== 'server') {
            if (!props.flow.ctx.config.dependencies.ignoreAllExternal) {
              log.error('Problem when resolving require "$text" in $file', {
                text: text,
                file: pm.module.getShortPath(),
              });
            }
          }
        } else {
          log.progressFormat(
            target.module.isExecutable() ? 'Transpile' : 'Register',
            `"${text}" from ${pm.module.getShortPath()} to ${target.module.getShortPath()}`,
          );

          addModule2ProductionSchema(props, target);
          return ts.createCall(
            ts.createPropertyAccess(ts.createIdentifier('$fsx'), ts.createIdentifier('r')),
            undefined,
            [ts.createNumericLiteral(target.getId().toString())],
          );
        }
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
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

  const result = ts.transpileModule(text, {
    fileName: prodModule.module.props.absPath,
    compilerOptions: compilerOptions,
    transformers: { after: [moduleTransformer(props, prodModule)] },
  });

  prodModule.transpiledSourceMap = requireSourceMaps
    ? fixModuleSourceMap(prodModule.module, result.sourceMapText)
    : undefined;

  prodModule.transpiledContent = result.outputText;
}

export function transpileStage(props: IProductionFlow) {
  const { productionContext, ctx, packages } = props;

  const log = props.ctx.log;

  log.progress('<dim><bold>- Transpile stage</bold></dim>');
  const opts: ITranspileStageProps = {
    flow: props,
    amount: 0,
  };

  const modules = productionContext.getProjectEntries();

  modules.forEach(mod => addModule2ProductionSchema(opts, mod.productionModule));

  log.progressEnd('<green><bold>$checkmark $amount Modules have been transpiled</bold></green>', {
    amount: opts.amount,
  });
}
