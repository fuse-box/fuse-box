import * as ts from 'typescript';
import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { fixModuleSourceMap } from '../../sourcemaps/helpers';
import { tsTransform } from '../../transform/tsTransform';

export function pluginTypescript() {
  return (ctx: Context) => {
    const ict = ctx.ict;

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
          !analysis.report.containsJSX &&
          !analysis.report.es6Syntax &&
          (!analysis.replaceable || analysis.replaceable.length === 0)
        ) {
          return props;
        }
      }

      //console.log(analysis.report);
      let requireSourceMaps = true;

      if (pkg.isDefaultPackage) {
        if (!config.sourceMap.project) {
          requireSourceMaps = false;
        }
      } else {
        if (!config.sourceMap.vendor) {
          requireSourceMaps = false;
        }
      }

      const compilerOptions: ts.CompilerOptions = {
        ...ctx.tsConfig.compilerOptions,
      };

      if (requireSourceMaps) {
        compilerOptions.sourceMap = true;
        compilerOptions.inlineSources = true;
      }

      compilerOptions.outDir = undefined;
      compilerOptions.outFile = undefined;

      ict.promise(async () => {
        ctx.log.progressFormat('Typescript', '$package/$name', {
          name: module.props.fuseBoxPath,
          package: module.pkg.props.meta.name,
        });

        const data = tsTransform({
          fileName: module.props.absPath,
          input: module.contents,
          webWorkers: analysis.workers,
          compilerOptions: compilerOptions,
          transformers: ctx.customTransformers || {},
          replacements: !analysis.report.statementsReplaced && analysis.replaceable,
        });
        module.contents = data.outputText;
        module.sourceMap = requireSourceMaps ? fixModuleSourceMap(module, data.sourceMapText) : undefined;
        analysis.report.statementsReplaced = true;
        analysis.report.transpiled = true;
      });

      return props;
    });
  };
}
