import { IStyleSheetProps } from '../config/IStylesheetProps';

export interface IAsModuleProps {
  scopeBehaviour?: 'global' | 'local';
  globalModulePaths?: Array<RegExp>;
  generateScopedName?: (name: string, fileName: string, css: String) => string | string;
  plugins?: Array<any>;
}
export interface IPluginCommon {
  stylesheet?: IStyleSheetProps;
  asText?: boolean;
  asModule?: IAsModuleProps;
  useDefault?: boolean;
}
