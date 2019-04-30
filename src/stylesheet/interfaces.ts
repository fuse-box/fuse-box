export interface IStylesheetModuleResponse {
  map?: string;
  css: string;
}

export interface IStyleSheetProcessor {
  render: () => Promise<IStylesheetModuleResponse>;
}
