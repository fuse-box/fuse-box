export interface IStylesheetModuleResponse {
  css: string;
  json?: any;
  map?: string;
}

export interface IStyleSheetProcessor {
  render: () => Promise<IStylesheetModuleResponse>;
}
