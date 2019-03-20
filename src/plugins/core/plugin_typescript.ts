import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { tsTransform } from '../../transform/tsTransform';
import * as ts from 'typescript';

export function pluginTypescript() {
  return (ctx: Context) => {
    const ict = ctx.interceptor;

    ict.on('bundle_resolve_module', (props: { module: Module }) => {
      if (!props.module.isExecutable()) {
        return;
      }

      const module = props.module;
      const pkg = module.pkg;
      const config = ctx.config;
      const analysis = module.fastAnalysis;
      if (!analysis || !analysis.report || analysis.report.transpiled || !module.contents) {
        return props;
      }

      /* we should not transpile if:
       - That's not a typescript module
       - Doesn't contain JSX
       - Doesn't contain es6 import syntax
      */
      if (!props.module.isTypescriptModule()) {
        if (
          (!analysis.replaceable || analysis.replaceable.length === 0) &&
          !analysis.report.containsJSX &&
          !analysis.report.es6Syntax
        ) {
          return;
        }
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
