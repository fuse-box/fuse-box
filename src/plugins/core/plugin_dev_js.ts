import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { fastTransform } from '../../transform/fastTransform';

export function pluginDevJs() {
  return (ctx: Context) => {
    const ict = ctx.interceptor;
    ict.on('bundle_resolve_js_module', (props: { module: Module }) => {
      const module = props.module;
      const config = ctx.config;

      const analysis = module.fastAnalysis;

      let continueWithFastTransform =
        analysis && !!analysis.report && analysis.report.es6Syntax && !analysis.report.containsJSX;

      if (module.pkg.isDefaultPackage && config.options.projectSourceMap) {
        continueWithFastTransform = false;
      }

      if (!module.pkg.isDefaultPackage && config.options.vendorSourceMap) {
        continueWithFastTransform = false;
      }

      if (continueWithFastTransform) {
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
      } else {
        if (analysis && analysis.report) {
          analysis.report.statementsReplaced = false;
          analysis.report.transpiled = false;
        }
      }
      return props;
    });
  };
}
