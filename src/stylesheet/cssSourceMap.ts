import * as path from 'path';
import { Context } from '../core/Context';
import { IModule } from '../ModuleResolver/Module';
import { extractFuseBoxPath, joinFuseBoxPath } from '../utils/utils';
export interface IAlignCSSSourceMap {
  module: IModule;
  sourceMap: any;
  ctx: Context;
}

export function alignCSSSourceMap(props: IAlignCSSSourceMap): string {
  const { ctx, sourceMap, module } = props;

  const json = sourceMap.file ? sourceMap : JSON.parse(sourceMap.toString());
  const rootPath = path.dirname(module.absPath);
  const isDefault = true; //module.pkg.isDefaultPackage;

  if (json.sources) {
    for (let i = 0; i < json.sources.length; i++) {
      const name = json.sources[i];

      const resolvedPath = path.resolve(rootPath, name);
      if (isDefault) {
        json.sources[i] = joinFuseBoxPath(
          ctx.config.sourceMap.sourceRoot,
          extractFuseBoxPath(ctx.config.homeDir, resolvedPath),
        );
      } else {
        const pkg = module.pkg;

        const packageRoot = 'pkg/';
        const packageName = pkg.publicName;
        json.sources[i] = joinFuseBoxPath(
          ctx.config.defaultSourceMapModulesRoot,
          packageName,
          extractFuseBoxPath(packageRoot, resolvedPath),
        );
      }
    }
  }
  return JSON.stringify(json);
}
