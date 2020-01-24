import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/context';

import { IModule } from '../moduleResolver/module';
import { wrapContents } from '../plugins/pluginStrings';
import { IStylesheetModuleResponse } from './interfaces';

export interface ICSSModuleRender {
  ctx: Context;
  data: IStylesheetModuleResponse;
  module: IModule;
  options: IStyleSheetProps;
  useDefault?: boolean;
}
export function cssAsTextRender(props: ICSSModuleRender) {
  const { data, module } = props;

  let contents = wrapContents(JSON.stringify(data.css), props.useDefault);

  module.contents = contents;
}
