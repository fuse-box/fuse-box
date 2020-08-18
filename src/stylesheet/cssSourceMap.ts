import * as path from 'path';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { makePublicPath } from '../utils/utils';
export interface IAlignCSSSourceMap {
  ctx: Context;
  module: IModule;
  sourceMap: any;
}

export function alignCSSSourceMap(props: IAlignCSSSourceMap): string {
  const { module, sourceMap } = props;

  const json = sourceMap.file ? sourceMap : JSON.parse(sourceMap.toString());
  const rootPath = path.dirname(module.absPath);
  if (json.sources) {
    for (let i = 0; i < json.sources.length; i++) {
      const name = json.sources[i];
      const resolvedPath = path.resolve(rootPath, name);
      json.sources[i] = makePublicPath(resolvedPath);
    }
  }
  return JSON.stringify(json);
}
