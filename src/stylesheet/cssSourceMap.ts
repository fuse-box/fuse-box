import { Module } from '../core/Module';
import { Context } from '../core/Context';
import * as path from 'path';
import { extractFuseBoxPath, joinFuseBoxPath, ensureFuseBoxPath } from '../utils/utils';
export interface IAlignCSSSourceMap {
  module: Module;
  sourceMap: Buffer | string;
  ctx: Context;
}

export function alignCSSSourceMap(props: IAlignCSSSourceMap): string {
  const { ctx, sourceMap, module } = props;
  const json = JSON.parse(sourceMap.toString());
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
