import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import { readFile } from '../utils/utils';
import { cssAutoImport } from './cssAutoImport';
import { cssHandleResources, ICSSHandleResourcesProps } from './cssHandleResources';
import { cssResolveModule } from './cssResolveModule';
import { alignCSSSourceMap } from './cssSourceMap';
import { IStyleSheetProcessor, IStylesheetModuleResponse } from './interfaces';

export interface ISassProps {
  macros?: { [key: string]: string };
}
export interface ISassHandlerProps {
  ctx: Context;
  module: IModule;
  options: IStyleSheetProps;
}

interface IRenderModuleProps {
  ctx: Context;
  module: IModule;
  nodeSass: any;
  options?: IStyleSheetProps;
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
    options: props.options,
    paths,
    target: props.url,
    tryUnderscore: true,
  });

  if (resolved.success) {
    let fileContents = readFile(resolved.path);
    if (props.options.autoImport) {
      fileContents = cssAutoImport({ contents: fileContents, stylesheet: props.options, url: resolved.path });
    }

    return cssHandleResources({ contents: fileContents, path: resolved.path }, props);
  }
}

export async function renderModule(props: IRenderModuleProps): Promise<IStylesheetModuleResponse> {
  const { ctx, module, nodeSass } = props;
  const requireSourceMap = module.isCSSSourceMapRequired;

  // handle root resources
  const processed = cssHandleResources(
    { contents: module.contents, path: module.absPath },
    { ctx: props.ctx, module: module, options: props.options },
  );

  let contents = processed.contents;
  if (props.options.autoImport) {
    contents = cssAutoImport({ contents: contents, stylesheet: props.options, url: props.module.absPath });
  }
  //const processed = { contents: module.contents, file: module.props.absPath };
  const data = await evaluateSass(nodeSass, {
    data: contents,
    file: processed.file,
    sourceMap: requireSourceMap,
    includePaths: [path.dirname(module.absPath)],
    outFile: module.absPath,
    sourceMapContents: requireSourceMap,
    indentedSyntax: module.extension === ".sass",
    importer: function(url, prev) {
      // gathering imported dependencies in order to let the watcher pickup the right module

      const result = sassImporter({ options: props.options, ctx, module, url, fileRoot: prev });
      if (result && result.file) {
        ctx.setLinkedReference(result.file, props.module);
        return result;
      }

      return url;
    },
  });
  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ ctx: props.ctx, module: props.module, sourceMap: data.map });
  }
  return { css: data.css && data.css.toString(), map: sourceMap };
}

export function sassHandler(props: ISassHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;
  const nodeSass = require('node-sass');
  if (!nodeSass) {
    return;
  }

  return {
    render: async () => renderModule({ ctx, module, nodeSass, options: props.options }),
  };
}
