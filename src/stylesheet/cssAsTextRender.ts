import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { IStylesheetModuleResponse } from './interfaces';

export interface ICSSModuleRender {
  ctx: Context;
  module: Module;
  options: IStyleSheetProps;
  data: IStylesheetModuleResponse;
}
export function cssAsTextRender(props: ICSSModuleRender) {
  const { module, data } = props;

  let contents = `module.exports = ${JSON.stringify(data.css)}`;

  module.contents = contents;
}
