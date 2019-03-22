import { Module } from '../core/Module';

export function fixModuleSourceMap(module: Module, sourceMapText: string): string {
  let jsonSourceMaps = JSON.parse(sourceMapText);
  jsonSourceMaps.sources = [module.getSourceMapPath()];
  if (module.fastAnalysis.report.dynamicImports) {
    // fixing the replaces import statements
    // so the sourceContent will look the same
    let sourcesContent = jsonSourceMaps.sourcesContent;
    if (sourcesContent && sourcesContent[0]) {
      sourcesContent[0] = sourcesContent[0].replace(/\$fsmp\$/g, 'import');
    }
  }
  return JSON.stringify(jsonSourceMaps);
}
