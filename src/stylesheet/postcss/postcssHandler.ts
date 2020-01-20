import * as path from 'path';
import * as postcss from 'postcss';
import * as atImport from 'postcss-import';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/Context';
import { FuseBoxLogAdapter } from '../../fuse-log/FuseBoxLogAdapter';
import { IModule } from '../../ModuleResolver/Module';
import { readFile } from '../../utils/utils';
import { cssHandleResources } from '../cssHandleResources';
import { cssResolveModule } from '../cssResolveModule';
import { alignCSSSourceMap } from '../cssSourceMap';
import { IStylesheetModuleResponse, IStyleSheetProcessor } from '../interfaces';

interface IRenderModuleProps {
  options?: IStyleSheetProps;
  ctx: Context;
  module: IModule;
}

async function callPostCSS(
  plugins: Array<any>,
  css: string,
  options,
  logger: FuseBoxLogAdapter,
): Promise<{ map: string; css: string }> {
  return new Promise((resolve, reject) => {
    postcss(plugins)
      .process(css, options)
      .then(resolve as any)
      .catch(reject);
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
      if (props.options.breakDependantsCache) {
        props.module.breakDependantsCache = true;
      }
      //props.module.addWeakReference(resolved.path);
      return resolved.path;
    }
  }

  const requireSourceMap = props.module.isCSSSourceMapRequired;

  // handle root resources
  const processed = cssHandleResources(
    { path: props.module.absPath, contents: props.module.contents },
    { options: props.options, ctx: props.ctx, module: props.module },
  );
  let pluginList: Array<any> = [atImport({ load: loader, resolve: resolver })];
  if (props.options.postCSS) {
    if (props.options.postCSS.plugins) {
      pluginList = pluginList.concat(props.options.postCSS.plugins);
    }
  }

  const data = await callPostCSS(
    pluginList,
    processed.contents,
    {
      from: props.module.absPath,
      to: props.module.absPath,
      map: requireSourceMap && { inline: false },
    },
    props.ctx.log,
  );

  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ module: props.module, sourceMap: data.map, ctx: props.ctx });
  }

  return { map: sourceMap, css: data.css && data.css.toString() };
}
export interface IPostCSSHandlerProps {
  ctx: Context;
  module: IModule;
  options: IStyleSheetProps;
}

export function postCSSHandler(props: IPostCSSHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;

  return {
    render: async () => renderModule({ ctx, module, options: props.options }),
  };
}
