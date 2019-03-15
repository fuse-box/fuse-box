import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { tsTransform } from '../../transform/tsTransform';
import * as ts from 'typescript';

export function pluginTypescript() {
  return (ctx: Context) => {
    const ict = ctx.interceptor;

    ict.on('bundle_resolve_module', (props: { module: Module }) => {
      const module = props.module;
      const pkg = module.pkg;
      const config = ctx.config;
      const analysis = module.fastAnalysis;
      if (!analysis || !analysis.report || analysis.report.transpiled || !module.contents) {
        return props;
      }

      let requireSourceMaps = true;

      if (pkg.isDefaultPackage) {
        if (!config.options.projectSourceMap) {
          requireSourceMaps = false;
        }
      } else {
        if (!config.options.vendorSourceMap) {
          requireSourceMaps = false;
        }
      }

      const compilerOptions: ts.CompilerOptions = {
        ...ctx.tsConfig.compilerOptions,
        sourceMap: requireSourceMaps,
      };

      ict.promise(async () => {
        const data = tsTransform({
          input: module.contents,
          compilerOptions: compilerOptions,
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
