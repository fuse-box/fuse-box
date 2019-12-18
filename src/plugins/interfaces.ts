import { IStyleSheetProps } from '../config/IStylesheetProps';

export interface IAsModuleProps {
  globalModulePaths?: Array<RegExp>;
  plugins?: Array<any>;
  scopeBehaviour?: 'global' | 'local';
  generateScopedName?: (name: string, fileName: string, css: String) => string | string;
}
export interface IPluginCommon {
  asModule?: IAsModuleProps;
  asText?: boolean;
  stylesheet?: IStyleSheetProps;
  useDefault?: boolean;
}
