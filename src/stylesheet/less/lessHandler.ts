import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { readFile } from '../../utils/utils';
import { cssHandleResources } from '../cssHandleResources';
import { cssResolveModule } from '../cssResolveModule';
import { alignCSSSourceMap } from '../cssSourceMap';
import { IStyleSheetProcessor } from '../interfaces';

export interface ILessHandlerProps {
  ctx: Context;
  module: IModule;
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

export async function renderModule(props: { ctx: Context; less: any; module: IModule; options: IStyleSheetProps }) {
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
                options: props.options,
                paths,
                target: url,
                tryUnderscore: true,
              });
              if (resolved.success) {
                if (props.options.breakDependantsCache) {
                  props.module.breakDependantsCache = true;
                }
                props.module.ctx.setLinkedReference(resolved.path, props.module);

                const contents = readFile(resolved.path);

                const processed = cssHandleResources(
                  { contents: contents, path: resolved.path },
                  { ctx: props.ctx, module: props.module, options: props.options },
                );

                return resolve({ contents: processed.contents, environment, filename: resolved.path, options });
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
  const requireSourceMap = props.module.isCSSSourceMapRequired;

  // handle root resources
  const processed = cssHandleResources(
    { contents: props.module.contents, path: props.module.absPath },
    { ctx: props.ctx, module: props.module, options: props.options },
  );

  let pluginList: Array<any> = [Importer];
  let compilerOptions: any = {};
  if (props.options.less) {
    if (props.options.less.plugins) {
      pluginList = pluginList.concat(props.options.less.plugins);
    }
    if (props.options.less.options) {
      compilerOptions = props.options.less.options;
    }
  }

  const data = await renderWithLess(props.less, processed.contents, {
    ...compilerOptions,
    sourceMap: requireSourceMap && { outputSourceFiles: true },
    filename: module.absPath,
    plugins: pluginList,
  });

  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ ctx: props.ctx, module: props.module, sourceMap: data.map });
  }

  return { css: data.css, map: sourceMap };
}
export function lessHandler(props: ILessHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;
  const less = require('less');
  return {
    render: async () => renderModule({ ctx, less, module, options: props.options }),
  };
}
