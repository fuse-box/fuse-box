import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { fastHash, joinFuseBoxPath } from '../utils/utils';
import { IStylesheetModuleResponse } from './interfaces';

export interface ICSSModuleRender {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
  data: IStylesheetModuleResponse;
}
export function cssDevModuleRender(props: ICSSModuleRender) {
  const { ctx, module, data } = props;
  const filePath = module.pkg.getPublicName() + '/' + module.props.fuseBoxPath;
  // let the context know

  let cssData = data.css;

  if (ctx.config.sourceMap.css && data.map) {
    const resourcePublicRoot = ctx.config.getResourcePublicRoot();
    // generating a new name for our sourcemap
    const name = `${fastHash(module.props.absPath)}.css.map`;
    // defining a public path (that browser will be able to reach)
    const publicPath = joinFuseBoxPath(resourcePublicRoot, 'css', name);

    // replace existing sourceMappingURL
    cssData = cssData.replace(/(sourceMappingURL=)([^\s]+)/, `$1${publicPath}`);

    // figuring out where to write that css
    const targetSourceMapPath = path.join(ctx.config.getResourceFolder(ctx), 'css', name);

    ctx.log.verbose('<cyan>Writing css sourcemap to $file</cyan>', { file: targetSourceMapPath });
    ctx.writer.write(targetSourceMapPath, data.map);
  }

  let contents = `require("fuse-box-css")(${JSON.stringify(filePath)},${JSON.stringify(cssData)})`;

  module.contents = contents;
}
