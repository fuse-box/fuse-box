import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { fastTransform } from '../../transform/fastTransform';
import { tsTransform } from '../../transform/tsTransform';

export function pluginTypescript() {
  return (ctx: Context) => {
    const ict = ctx.interceptor;
    ict.on('bundle_resolve_module', (props: { module: Module }) => {
      const module = props.module;
      const analysis = module.fastAnalysis;
      if ((!analysis && !analysis.report) || analysis.report.transpiled || !module.contents) {
        return props;
      }

      ict.promise(async () => {
        const data = tsTransform({
          input: module.contents,
          replacements: !analysis.report.statementsReplaced && analysis.replaceable,
        });
        module.contents = data.outputText;
        module.sourceMap = data.sourceMapText;
        analysis.report.statementsReplaced = true;
        analysis.report.transpiled = true;
      });

      return props;
    });
  };
}
