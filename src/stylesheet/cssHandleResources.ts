import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { IModule } from '../ModuleResolver/Module';
import { cssResolveURL } from './cssResolveURL';

export interface ICSSHandleResourcesProps {
  options: IStyleSheetProps;
  ctx: Context;
  module: IModule;
  url?: string;
  fileRoot?: string;
}

export function cssHandleResources(
  opts: { path: string; contents: string },
  props: ICSSHandleResourcesProps,
): { file: string; contents: string } {
  const urlResolver = cssResolveURL({
    filePath: opts.path,
    ctx: props.ctx,
    contents: opts.contents,
    options: props.options,
  });

  return { file: opts.path, contents: urlResolver.contents };
}
