import * as path from 'path';
import postcss from 'postcss';
import * as atImport from 'postcss-import';
import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/context';
import { FuseBoxLogAdapter } from '../../fuseLog/FuseBoxLogAdapter';
import { IModule } from '../../moduleResolver/module';
import { readFile } from '../../utils/utils';
import { cssHandleResources } from '../cssHandleResources';
import { cssResolveModule } from '../cssResolveModule';
import { alignCSSSourceMap } from '../cssSourceMap';
import { IStyleSheetProcessor, IStylesheetModuleResponse } from '../interfaces';

interface IRenderModuleProps {
  ctx: Context;
  module: IModule;
  options?: IStyleSheetProps;
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
      { contents: readFile(url), path: url },
      {
        ctx: props.ctx,
        fileRoot: path.dirname(url),
        module: props.module,
        options: props.options,
        url: url,
      },
    );
    return data.contents;
  }

  function resolver(url, root, importOptions) {
    const userPaths = props.options.paths || [];

    const paths = [root].concat(userPaths);

    const resolved = cssResolveModule({
      extensions: ['.css', '.scss', '.sass'],
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
      return resolved.path;
    }
  }

  const requireSourceMap = props.module.isCSSSourceMapRequired;

  // handle root resources
  const processed = cssHandleResources(
    { contents: props.module.contents, path: props.module.absPath },
    { ctx: props.ctx, module: props.module, options: props.options },
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
    sourceMap = alignCSSSourceMap({ ctx: props.ctx, module: props.module, sourceMap: data.map });
  }

  return { css: data.css && data.css.toString(), map: sourceMap };
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
