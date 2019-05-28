import * as path from 'path';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { ImportType } from '../resolver/resolver';
import { createRequireConst, createVarString, ensureFuseBoxPath, createRequireConstWithObject } from '../utils/utils';
import { devImports } from './devPackage';

export function assembleFastAnalysis(ctx: Context) {
  const ict = ctx.ict;

  ict.on('assemble_fast_analysis', (props: { module: Module }) => {
    const module = props.module;
    // inject browser essentials into the module
    if (module.fastAnalysis && module.fastAnalysis.report) {
      const report = module.fastAnalysis.report;
      if (ctx.config.target === 'browser') {
        if (report.browserEssentials) {
          for (const item of report.browserEssentials) {
            // adding it to analysis to be picked up and created accordingly
            module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: item.moduleName });

            if (item.obj) {
              module.header.push(createRequireConstWithObject(item.moduleName, item.variable, item.obj));
            } else {
              module.header.push(createRequireConst(item.moduleName, item.variable));
            }
          }
        }
      }

      if (ctx.config.target === 'browser') {
        if (report.contains__filename) {
          module.header.push(createVarString('__filename', module.props.fuseBoxPath));
        }
        if (report.contains__dirname) {
          module.header.push(createVarString('__dirname', ensureFuseBoxPath(path.dirname(module.props.fuseBoxPath))));
        }
      }

      if (report.dynamicImports) {
        // TODO: make sure it works on server too
        module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: devImports.packageName });
        module.header.push(createRequireConst(devImports.packageName, devImports.variable));

        // replace dynamic imports everywhere throughout the code
        if (module.contents) {
          const re = /(\s+|^|\(|:)(import\()/g;
          module.contents = module.contents.replace(re, `$1${devImports.variable}(`);
        }
      }
    }
    return props;
  });
}
