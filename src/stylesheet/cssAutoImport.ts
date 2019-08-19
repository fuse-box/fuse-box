import { IStyleSheetProps } from '../config/IStylesheetProps';
import * as path from 'path';

export interface ICSSAutoImportProps {
  stylesheet: IStyleSheetProps;
  contents: string;
  url: string;
}
export function cssAutoImport(props: ICSSAutoImportProps) {
  let contents = props.contents;
  let extraHeaders = [];
  for (const autoImport of props.stylesheet.autoImport) {
    if (autoImport.file !== props.url) {
      if (!autoImport.capture || (autoImport.capture && autoImport.capture['test'](props.url))) {
        const relativePath = path.relative(path.dirname(props.url), autoImport.file);
        extraHeaders.push(`@import ${JSON.stringify(relativePath)};`);
      }
    }
  }
  if (extraHeaders.length) {
    contents = extraHeaders.join('\n') + '\n' + contents;
  }
  return contents;
}
