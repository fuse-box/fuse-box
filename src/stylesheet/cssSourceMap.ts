import * as path from 'path';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { extractFuseBoxPath, joinFuseBoxPath } from '../utils/utils';
export interface IAlignCSSSourceMap {
  ctx: Context;
  module: Module;
  sourceMap: any;
}

export function alignCSSSourceMap(props: IAlignCSSSourceMap): string {
  const { ctx, module, sourceMap } = props;

  const json = sourceMap.file ? sourceMap : JSON.parse(sourceMap.toString());
  const rootPath = path.dirname(module.props.absPath);
  const isDefault = module.pkg.isDefaultPackage;

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

        const packageRoot = pkg.props.meta.packageRoot;
        const packageName = pkg.getPublicName();
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
