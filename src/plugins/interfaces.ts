import { IStyleSheetProps } from '../config/IStylesheetProps';

export interface IPluginCommon {
  stylesheet?: IStyleSheetProps;
  asText?: boolean;
  useDefault?: boolean;
}
