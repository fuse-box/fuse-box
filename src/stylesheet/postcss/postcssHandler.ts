import * as postcss from 'postcss';
import * as atImport from 'postcss-import';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { Module } from '../../core/Module';
import { readFile } from '../../utils/utils';
import { cssHandleResources } from '../cssHandleResources';
import { cssResolveModule } from '../cssResolveModule';
import { IStylesheetModuleResponse, IStyleSheetProcessor } from '../interfaces';
import * as path from 'path';
import { alignCSSSourceMap } from '../cssSourceMap';

interface IRenderModuleProps {
  options?: IStyleSheetProps;
  ctx: Context;
  module: Module;
}

async function callPostCSS(plugins: Array<any>, css: string, options): Promise<{ map: string; css: string }> {
  return new Promise((resolve, reject) => {
    postcss(plugins)
      .process(css, options)
      .then(result => {
        return resolve(result as any);
      });
  });
}

export async function renderModule(props: IRenderModuleProps): Promise<IStylesheetModuleResponse> {
  function loader(url, opts) {
    const data = cssHandleResources(
      { path: url, contents: readFile(url) },
      {
        options: props.options,
        fileRoot: path.dirname(url),
        ctx: props.ctx,
        url: url,
        module: props.module,
      },
    );
    return data.contents;
  }

  function resolver(url, root, importOptions) {
    const userPaths = props.options.paths || [];

    const paths = [root].concat(userPaths);

    const resolved = cssResolveModule({
      extensions: ['.css', '.scss', '.sass'],
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
      return resolved.path;
    }
  }

  const requireSourceMap = props.module.isCSSSourceMapRequired();

  // handle root resources
  const processed = cssHandleResources(
    { path: props.module.props.absPath, contents: props.module.contents },
    { options: props.options, ctx: props.ctx, module: props.module },
  );
  let pluginList: Array<any> = [atImport({ load: loader, resolve: resolver })];
  if (props.options.postCSS) {
    if (props.options.postCSS.plugins) {
      pluginList = pluginList.concat(props.options.postCSS.plugins);
    }
  }

  const data = await callPostCSS(pluginList, processed.contents, {
    from: props.module.props.absPath,
    to: props.module.props.absPath,
    map: requireSourceMap && { inline: false },
  });

  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ module: props.module, sourceMap: data.map, ctx: props.ctx });
  }

  return { map: sourceMap, css: data.css && data.css.toString() };
}
export interface IPostCSSHandlerProps {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
}

export function postCSSHandler(props: IPostCSSHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;

  return {
    render: async () => renderModule({ ctx, module, options: props.options }),
  };
}
