import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { wrapContents } from '../plugins/pluginStrings';
import { IStylesheetModuleResponse } from './interfaces';

export interface ICSSModuleRender {
  ctx: Context;
  data: IStylesheetModuleResponse;
  module: Module;
  options: IStyleSheetProps;
  useDefault?: boolean;
}
export function cssAsTextRender(props: ICSSModuleRender) {
  const { data, module } = props;

  let contents = wrapContents(JSON.stringify(data.css), props.useDefault);

  module.contents = contents;
}
