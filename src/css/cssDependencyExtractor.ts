import { readFile } from '../utils/utils';

const IMPORT_REGEX = /@(?:import|value)[^"']+["']([^"']+)/g;

export interface ICSSDependencyExtractorProps {
  type: 'scss' | 'less' | 'stylus';
  file: string;
}

export function readCSSImports(contents: string, fn: (file: string) => void) {
  let match;
  while ((match = IMPORT_REGEX.exec(contents))) {
    fn(match[1]);
  }
}

export function cssDependencyExtractor(props: ICSSDependencyExtractorProps) {
  const contents = readFile(props.file);
}
