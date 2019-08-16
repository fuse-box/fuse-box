export interface IStylesheetModuleResponse {
  map?: string;
  css: string;
  json?: any;
}

export interface IStyleSheetProcessor {
  render: () => Promise<IStylesheetModuleResponse>;
}
