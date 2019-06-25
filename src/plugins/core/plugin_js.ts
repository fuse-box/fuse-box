import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { fixModuleSourceMap } from '../../sourcemaps/helpers';
import { fastTransform } from '../../transform/fastTransform/fastTransform';

export function pluginJS() {
  return (ctx: Context) => {
    const ict = ctx.ict;
    ict.on('bundle_resolve_module', (props: { module: Module }) => {
      const module = props.module;

      if (!module.isJavascriptModule()) return;

      const config = ctx.config;

      const analysis = module.fastAnalysis;

      let continueWithFastTransform =
        analysis &&
        !!analysis.report &&
        (analysis.report.es6Syntax || analysis.replaceable) &&
        !analysis.report.containsJSX;

      let withSourceMaps = false;

      if (module.pkg.isDefaultPackage && config.sourceMap.project) {
        withSourceMaps = true;
      }

      if (!module.pkg.isDefaultPackage && config.sourceMap.vendor) {
        withSourceMaps = true;
      }
      const debug = module.testPath('lib/_stream_readable.js');

      if (continueWithFastTransform) {
        ctx.log.measureTimeStart('fast');
        const transformation = fastTransform({
          absPath: module.props.absPath,
          webWorkers: analysis && analysis.workers,
          sourceMaps: withSourceMaps,
          input: module.contents,
          ast: module.fastAnalysis.ast,
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
        module.contents = transformation.code;
        if (withSourceMaps) {
          module.sourceMap = fixModuleSourceMap(module, transformation.sourceMap);
        }
        analysis.report.statementsReplaced = true;
        analysis.report.transpiled = true;

        if (ctx.log.level === 'verbose') {
          ctx.log.progressFormat('fastTransform', module.getShortPath() + ' in ' + ctx.log.measureTimeEnd('fast'));
        } else {
          ctx.log.progressFormat('fastTransform', module.getShortPath());
        }
        ctx.log.progressEnd();
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
