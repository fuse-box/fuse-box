export interface IImportRef {
  bundle?: boolean;
  matching: RegExp | string;
  replacement: string;
}
