import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { readFile } from '../utils/utils';
import { cssResolveURL } from './cssResolveURL';
import { resolveCSSModule } from './cssUtils';

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
  url: string;
  fileRoot: string;
}

interface IRenderModuleProps {
  options?: IStyleSheetProps;
  ctx: Context;
  module: Module;
  nodeSass: any;
}

function evaluateSass(sassModule, options): Promise<{ css: Buffer }> {
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

  const resolved = resolveCSSModule({
    extensions: ['.scss', '.sass', '.css'],
    paths,
    target: props.url,
    tryUnderscore: true,
    options: props.options,
  });

  if (resolved.success) {
    const contents = readFile(resolved.path);
    const urlResolver = cssResolveURL({
      filePath: resolved.path,
      ctx: props.ctx,
      contents,
      options: props.options,
    });

    return { file: resolved.path, contents: urlResolver.contents };
  }
}

export async function renderModule(props: IRenderModuleProps) {
  const { ctx, module, nodeSass } = props;
  const data = await evaluateSass(nodeSass, {
    data: module.contents,
    file: module.props.absPath,
    sourceMap: props.ctx.config.sourceMap.css,
    includePaths: [path.dirname(module.props.absPath)],
    outFile: module.props.absPath,
    sourceMapContents: true,
    importer: function(url, prev) {
      const result = sassImporter({ options: props.options, ctx, module, url, fileRoot: prev });
      if (result) return result;
      return url;
    },
  });
  console.log(data.css.toString());
}

export function sassHandler(props: ISassHandlerProps) {
  const { ctx, module } = props;
  const nodeSass = ctx.requireModule('node-sass');
  if (!nodeSass) {
    return;
  }

  module.read();

  // push to the bottom to not block the rest of the process
  ctx.ict.promise(async () => {
    try {
      await renderModule({ ctx, module, nodeSass, options: props.options });
    } catch (e) {
      ctx.log.error('$error in $file', {
        error: e.message,
        file: module.props.absPath,
      });
    }
  });
}
