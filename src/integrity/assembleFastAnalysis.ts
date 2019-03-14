import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { ImportType } from '../resolver/resolver';
import { createRequireConst } from '../utils/utils';
import { devImports } from './devPackage';

export function assembleFastAnalysis(ctx: Context) {
  const ict = ctx.interceptor;

  ict.on('assemble_fast_analysis', (props: { module: Module }) => {
    const module = props.module;
    // inject browser essentials into the module
    if (module.fastAnalysis && module.fastAnalysis.report) {
      const report = module.fastAnalysis.report;
      if (ctx.config.target === 'browser') {
        report.browserEssentials &&
          report.browserEssentials.forEach(item => {
            // adding it to analysis to be picked up and created accordingly
            module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: item });
            module.header.push(createRequireConst(item));
          });
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
