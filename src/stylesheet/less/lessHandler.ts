import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { readFile } from '../../utils/utils';
import { cssHandleResources } from '../cssHandleResources';
import { cssResolveModule } from '../cssResolveModule';
import { alignCSSSourceMap } from '../cssSourceMap';
import { IStyleSheetProcessor } from '../interfaces';

export interface ILessHandlerProps {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
}

async function renderWithLess(less, contents, options): Promise<{ map: string; css: string }> {
  return new Promise((resolve, reject) => {
    less.render(contents, options).then(
      function(output) {
        return resolve({ css: output.css, map: output.map });
      },
      function(error) {
        return reject(error);
      },
    );
  });
}

export async function renderModule(props: { ctx: Context; module: Module; less: any; options: IStyleSheetProps }) {
  const Importer = {
    install: (less, manager) => {
      manager.addFileManager(
        new (class extends less.FileManager {
          loadFile(url, root, options, environment) {
            return new Promise((resolve, reject) => {
              const userPaths = props.options.paths || [];
              const paths = [root].concat(userPaths);
              const resolved = cssResolveModule({
                extensions: ['.less', '.css'],
                paths,
                target: url,
                tryUnderscore: true,
                options: props.options,
              });
              if (resolved.success) {
                if (props.options.breakDepednantsCache) {
                  props.module.breakDependantsCache = true;
                }
                props.module.addWeakReference(resolved.path);
                const contents = readFile(resolved.path);

                const processed = cssHandleResources(
                  { path: resolved.path, contents: contents },
                  { options: props.options, ctx: props.ctx, module: props.module },
                );

                return resolve({ contents: processed.contents, filename: resolved.path, options, environment });
              } else {
                reject(`Cannot find module ${url} at ${root}`);
              }
            });
          }
        })(),
      );
    },
  };
  const module = props.module;
  const requireSourceMap = props.module.isCSSSourceMapRequired();

  // handle root resources
  const processed = cssHandleResources(
    { path: props.module.props.absPath, contents: props.module.contents },
    { options: props.options, ctx: props.ctx, module: props.module },
  );

  let pluginList: Array<any> = [Importer];
  if (props.options.less) {
    if (props.options.less.plugins) {
      pluginList = pluginList.concat(props.options.less.plugins);
    }
  }

  const data = await renderWithLess(props.less, processed.contents, {
    sourceMap: requireSourceMap && { outputSourceFiles: true },
    filename: module.props.absPath,
    plugins: pluginList,
  });

  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ module: props.module, sourceMap: data.map, ctx: props.ctx });
  }

  return { map: sourceMap, css: data.css };
}
export function lessHandler(props: ILessHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;

  const less = ctx.requireModule('less');
  if (!less) {
    return;
  }

  return {
    render: async () => renderModule({ ctx, module, less, options: props.options }),
  };
}
