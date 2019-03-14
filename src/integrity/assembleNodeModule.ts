import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { fastTransform } from '../transform/fastTransform';

export function assembleNodeModule(ctx: Context) {
  const ict = ctx.interceptor;

  ict.on('assemble_nm_module', (props: { module: Module }) => {
    const module = props.module;
    const analysis = module.fastAnalysis;
    if (!module.isTypescriptModule() && analysis && analysis.report) {
      if (analysis.report.es6Syntax) {
        module.contents = fastTransform({
          input: module.contents,
          sourceInterceptor: value => {
            if (analysis.replaceable) {
              const replacement =
                analysis.replaceable && analysis.replaceable.find(item => item.fromStatement === value);
              if (replacement) {
                return replacement.toStatement;
              }
            }
            return value;
          },
        });
        analysis.report.statementsReplaced = true;
        analysis.report.transpiled = true;
      }
    }
    return props;
  });
}
