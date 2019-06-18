import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { readFile } from '../utils/utils';
import { cssResolveModule } from './cssResolveModule';
import { cssResolveURL } from './cssResolveURL';
import { IStylesheetModuleResponse, IStyleSheetProcessor } from './interfaces';
import { alignCSSSourceMap } from './cssSourceMap';

export interface ISassProps {
  macros?: { [key: string]: string };
}
export interface ISassHandlerProps {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
}

interface ISassImporterProps {
  options: IStyleSheetProps;
  ctx: Context;
  module: Module;
  url?: string;
  fileRoot?: string;
}

interface IRenderModuleProps {
  options?: IStyleSheetProps;
  ctx: Context;
  module: Module;
  nodeSass: any;
}

function evaluateSass(sassModule, options): Promise<{ css: Buffer; map: Buffer }> {
  return new Promise((resolve, reject) => {
    sassModule.render(options, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

export function sassImporter(props: ISassImporterProps) {
  const userPaths = props.options.paths || [];
  const root = path.dirname(props.fileRoot);
  const paths = [root].concat(userPaths);

  const resolved = cssResolveModule({
    extensions: ['.scss', '.sass', '.css'],
    paths,
    target: props.url,
    tryUnderscore: true,
    options: props.options,
  });

  if (resolved.success) {
    return handleResources({ path: resolved.path, contents: readFile(resolved.path) }, props);
  }
}

function handleResources(
  opts: { path: string; contents: string },
  props: ISassImporterProps,
): { file: string; contents: string } {
  const urlResolver = cssResolveURL({
    filePath: opts.path,
    ctx: props.ctx,
    contents: opts.contents,
    options: props.options,
  });

  return { file: opts.path, contents: urlResolver.contents };
}

export async function renderModule(props: IRenderModuleProps): Promise<IStylesheetModuleResponse> {
  const { ctx, module, nodeSass } = props;
  let requireSourceMap = true;
  if (ctx.config.sourceMap.css === false) {
    requireSourceMap = false;
  }
  if (!module.pkg.isDefaultPackage && !ctx.config.sourceMap.vendor) {
    requireSourceMap = false;
  }

  // handle root resources
  const processed = handleResources(
    { path: module.props.absPath, contents: module.contents },
    { options: props.options, ctx: props.ctx, module: module },
  );

  //const processed = { contents: module.contents, file: module.props.absPath };
  const data = await evaluateSass(nodeSass, {
    data: processed.contents,
    file: processed.file,
    sourceMap: requireSourceMap,
    includePaths: [path.dirname(module.props.absPath)],
    outFile: module.props.absPath,
    sourceMapContents: requireSourceMap,
    importer: function(url, prev) {
      // gathering imported dependencies in order to let the watcher pickup the right module

      const result = sassImporter({ options: props.options, ctx, module, url, fileRoot: prev });

      if (props.options.breakDepednantsCache) {
        module.breakDependantsCache = true;
      }

      module.addWeakReference(result.file);
      if (result) return result;
      return url;
    },
  });
  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ module: props.module, sourceMap: data.map, ctx: props.ctx });
  }
  return { map: sourceMap, css: data.css && data.css.toString() };
}

export function sassHandler(props: ISassHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;
  const nodeSass = ctx.requireModule('node-sass');
  if (!nodeSass) {
    return;
  }

  return {
    render: async () => renderModule({ ctx, module, nodeSass, options: props.options }),
  };
}
