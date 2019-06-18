import { Context } from '../core/Context';
import { IStyleSheetProps } from './IStylesheetProps';
export interface ICreateStylesheetProps {
  ctx: Context;
  stylesheet?: IStyleSheetProps;
}
export function createStylesheetProps(props: ICreateStylesheetProps): IStyleSheetProps {
  const ctx = props.ctx;
  const options: IStyleSheetProps = {};

  if (props.stylesheet) {
    options.groupResourcesFilesByType = props.stylesheet.groupResourcesFilesByType;
    options.ignoreChecksForCopiedResources = props.stylesheet.ignoreChecksForCopiedResources;
  }

  if (options.groupResourcesFilesByType === undefined) {
    if (ctx.config.stylesheet) {
      options.groupResourcesFilesByType =
        ctx.config.stylesheet.groupResourcesFilesByType !== undefined
          ? ctx.config.stylesheet.groupResourcesFilesByType
          : true;
    } else {
      options.groupResourcesFilesByType = true;
    }
  }

  if (options.ignoreChecksForCopiedResources === undefined) {
    if (ctx.config.stylesheet) {
      options.ignoreChecksForCopiedResources =
        ctx.config.stylesheet.ignoreChecksForCopiedResources !== undefined
          ? ctx.config.stylesheet.ignoreChecksForCopiedResources
          : true;
    } else {
      options.groupResourcesFilesByType = true;
    }
  }

  return options;
}
