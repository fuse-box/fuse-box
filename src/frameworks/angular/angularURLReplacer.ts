import { findReplace, matchAll } from '../../utils/utils';
import { STYLESHEET_EXTENSIONS } from '../../config/extensions';
import * as path from 'path';

export interface IAngularURLReplacer {
  content: string;
}
export function angularURLReplacer(props: IAngularURLReplacer) {
  let result = findReplace(props.content, /(styleUrls)\s*:\s*\[\s*(['"][^\]]+)\]/, args => {
    const params = args[2];
    const files = [];
    matchAll(/['"]([^"']+)/gi, params, matches => {
      if (STYLESHEET_EXTENSIONS.indexOf(path.extname(matches[1])) > -1) {
        files.push(matches[1]);
      }
    });
    if (!files.length) {
      return args[0];
    }
    return `styles : [${files.map(file => 'require(' + JSON.stringify(file) + ')')}]`;
  });

  result = findReplace(result, /(templateUrl)\s*:\s['"]([^"']+)['"]/, args => {
    return `template : require(${JSON.stringify(args[2])})`;
  });
  return result;
}
