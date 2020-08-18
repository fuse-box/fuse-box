import { IStyleSheetProps } from '../../config/IStylesheetProps';
import { Context } from '../../core/context';
import { IModule } from '../../moduleResolver/module';
import { replaceCSSMacros } from '../cssResolveModule';
import { resolveCSSResource } from '../cssResolveURL';
import { alignCSSSourceMap } from '../cssSourceMap';
import { IStyleSheetProcessor } from '../interfaces';
import { stylusRender } from './stylusRenderer';
export interface IPostCSSHandlerProps {
  ctx: Context;
  module: IModule;
  options: IStyleSheetProps;
}

async function renderModule(props: IPostCSSHandlerProps) {
  const data = await stylusRender({
    contents: props.module.contents,
    withSourceMaps: props.module.isCSSSourceMapRequired,
    paths: props.options.paths,
    filePath: props.module.absPath,

    onImportString: str => {
      if (props.options.macros) {
        return replaceCSSMacros(str, props.options.macros);
      }
    },
    onURL: (filePath, value) => {
      const result = resolveCSSResource(value, {
        contents: '',
        ctx: props.ctx,
        filePath: filePath,
        options: props.options,
      });
      if (result) {
        return result.publicPath;
      } else {
        props.ctx.log.warn(`Unable to resolve ${value} in ${filePath}`);
      }
    },
    onImportFile: item => {
      if (!item.isExternal) {
        if (props.options.breakDependantsCache) {
          props.module.breakDependantsCache = true;
        }
        props.module.ctx.setLinkedReference(item.value, props.module);
      }
    },
  });

  let sourceMap: string;
  if (data.map) {
    sourceMap = alignCSSSourceMap({ ctx: props.ctx, module: props.module, sourceMap: data.map });
  }
  return { css: data.css, map: sourceMap };
}

export function stylusHandler(props: IPostCSSHandlerProps): IStyleSheetProcessor {
  const { ctx, module } = props;

  return {
    render: async () => renderModule({ ctx, module, options: props.options }),
  };
}
