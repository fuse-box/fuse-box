import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { readFile } from '../utils/utils';
import { cssHandleResources, ICSSHandleResourcesProps } from './cssHandleResources';
import { cssResolveModule } from './cssResolveModule';
import { alignCSSSourceMap } from './cssSourceMap';
import { IStylesheetModuleResponse, IStyleSheetProcessor } from './interfaces';

export interface ISassProps {
  macros?: { [key: string]: string };
}
export interface ISassHandlerProps {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
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

export function sassImporter(props: ICSSHandleResourcesProps) {
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
    return cssHandleResources({ path: resolved.path, contents: readFile(resolved.path) }, props);
  }
}

export async function renderModule(props: IRenderModuleProps): Promise<IStylesheetModuleResponse> {
  const { ctx, module, nodeSass } = props;
  const requireSourceMap = module.isCSSSourceMapRequired();

  // handle root resources
  const processed = cssHandleResources(
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
      if (result && result.file) {
        module.addWeakReference(result.file);
        return result;
      }

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
