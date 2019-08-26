import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { IStylesheetModuleResponse } from './interfaces';
import { wrapContents } from '../plugins/pluginStrings';

export interface ICSSModuleRender {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
  useDefault?: boolean;
  data: IStylesheetModuleResponse;
}
export function cssAsTextRender(props: ICSSModuleRender) {
  const { module, data } = props;

  let contents = wrapContents(JSON.stringify(data.css), props.useDefault);

  module.contents = contents;
}
