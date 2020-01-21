import * as path from 'path';
import { Context } from '../core/Context';
import { IModule } from '../module-resolver/Module';
import { PackageType } from '../module-resolver/Package';
import { extractFuseBoxPath, joinFuseBoxPath } from '../utils/utils';
export interface IAlignCSSSourceMap {
  ctx: Context;
  module: IModule;
  sourceMap: any;
}

export function alignCSSSourceMap(props: IAlignCSSSourceMap): string {
  const { ctx, module, sourceMap } = props;

  const json = sourceMap.file ? sourceMap : JSON.parse(sourceMap.toString());
  const rootPath = path.dirname(module.absPath);
  const isDefault = module.pkg.type === PackageType.USER_PACKAGE;

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
