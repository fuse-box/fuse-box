import { Context } from '../core/Context';
import { Module } from '../core/Module';

export function assembleTypescriptModule(ctx: Context) {
  const ict = ctx.interceptor;

  ict.on('assemble_ts_module', (props: { module: Module }) => {
    const module = props.module;

    const analysis = module.fastAnalysis;
    if (analysis && analysis.report) {
      if (analysis.report.dynamicImports) {
      }
      //  const expression = /(?:[^\.\w]|^)(import\())/g;
      // if (expression.test(targetContent)) {
      // 	targetContent = targetContent.replace(expression, "$1$fsmp$(");
      // }
    }
    return props;
  });
}
