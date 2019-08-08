import { Context } from '../core/Context';
import { IStyleSheetProps } from './IStylesheetProps';
export interface ICreateStylesheetProps {
  ctx: Context;
  stylesheet?: IStyleSheetProps;
}
export function createStylesheetProps(props: ICreateStylesheetProps): IStyleSheetProps {
  const ctx = props.ctx;
  const options: IStyleSheetProps = {};
  // global configuration
  if (ctx.config.stylesheet) {
    options.paths = ctx.config.stylesheet.paths;
    // global post css config
    options.postCSS = ctx.config.stylesheet.postCSS;
    options.less = ctx.config.stylesheet.less;
    options.macros = ctx.config.stylesheet.macros;
  }

  if (props.stylesheet) {
    options.groupResourcesFilesByType = props.stylesheet.groupResourcesFilesByType;
    options.ignoreChecksForCopiedResources = props.stylesheet.ignoreChecksForCopiedResources;
    if (props.stylesheet.paths) options.paths = props.stylesheet.paths;

    if (props.stylesheet.postCSS !== undefined) {
      // local override of postcss
      options.postCSS = props.stylesheet.postCSS;
    }

    if (props.stylesheet.less !== undefined) {
      options.less = props.stylesheet.less;
    }

    if (props.stylesheet.macros) {
      options.macros = props.stylesheet.macros;
    }
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
