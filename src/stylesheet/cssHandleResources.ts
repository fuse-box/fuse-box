import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { IModule } from '../moduleResolver/Module';
import { cssResolveURL } from './cssResolveURL';

export interface ICSSHandleResourcesProps {
  ctx: Context;
  fileRoot?: string;
  module: IModule;
  options: IStyleSheetProps;
  url?: string;
}

export function cssHandleResources(
  opts: { contents: string; path: string },
  props: ICSSHandleResourcesProps,
): { contents: string; file: string } {
  const urlResolver = cssResolveURL({
    contents: opts.contents,
    ctx: props.ctx,
    filePath: opts.path,
    options: props.options,
  });

  return { contents: urlResolver.contents, file: opts.path };
}
