import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { fixModuleSourceMap } from '../../sourcemaps/helpers';
import { fastTransform } from '../../transform/fastTransform';

export function pluginDevJs() {
  return (ctx: Context) => {
    const ict = ctx.ict;
    ict.on('bundle_resolve_js_module', (props: { module: Module }) => {
      const module = props.module;
      const config = ctx.config;

      const analysis = module.fastAnalysis;

      let continueWithFastTransform =
        analysis && !!analysis.report && analysis.report.es6Syntax && !analysis.report.containsJSX;

      let withSourceMaps = false;

      if (module.pkg.isDefaultPackage && config.sourceMap.project) {
        withSourceMaps = true;
      }

      if (!module.pkg.isDefaultPackage && config.sourceMap.vendor) {
        withSourceMaps = true;
      }

      if (continueWithFastTransform) {
        ctx.log.info('Apply fastTransform on $package/$name', {
          name: module.props.fuseBoxPath,
          package: module.pkg.props.meta.name,
        });
        const transformation = fastTransform({
          sourceMaps: withSourceMaps,
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
        module.contents = transformation.code;
        if (withSourceMaps) {
          module.sourceMap = fixModuleSourceMap(module, transformation.sourceMap);
        }
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
