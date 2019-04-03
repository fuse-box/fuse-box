import { findReplace } from '../utils/utils';
import { codes } from './chroma';

export function codeLog(input: string) {
  return findReplace(input, /<(\/)?([a-zA-Z]+)>/gi, args => {
    const [, closing, name] = args;

    if (codes[name]) {
      if (closing) {
        return `\u001b[${codes[name][1]}m`;
      }
      return `\u001b[${codes[name][0]}m`;
    }
    return name;
  });
}
