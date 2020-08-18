import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { fileExists } from '../utils/utils';

export interface IResolveCSSModuleProps {
  extensions: Array<string>;
  options: IStyleSheetProps;
  paths: Array<string>;
  target: string;
  tryUnderscore: boolean;
}

function tryCSSModule(target: string, props: IResolveCSSModuleProps) {
  if (fileExists(target)) {
    return target;
  }
  let fname = path.basename(target);
  if (props.tryUnderscore && !/^_/.test(fname)) {
    const pathWithUnderScore = path.join(path.dirname(target), '_' + fname);
    if (fileExists(pathWithUnderScore)) {
      return pathWithUnderScore;
    }
  }
}

export function replaceCSSMacros(target: string, macros: { [key: string]: string }) {
  for (const key in macros) {
    target = target.replace(key, `${macros[key]}`);
  }
  return target;
}

export interface IResolveCSSModuleResult {
  path?: string;
  success: boolean;
}

export function cssResolveModule(props: IResolveCSSModuleProps): IResolveCSSModuleResult {
  let target = props.target;
  if (props.options.macros) {
    target = replaceCSSMacros(target, props.options.macros);
  }

  if (path.isAbsolute(target)) {
    // in case of an absolute path we don't need to iterate over paths,
    // saving the time here
    if (!path.extname(target)) {
      for (const extension of props.extensions) {
        const res = tryCSSModule(target + extension, props);
        if (res) return { path: res, success: true };
      }
    } else {
      // direct try if an extension is specified
      const found = tryCSSModule(target, props);
      if (found) {
        return { path: target, success: true };
      }
    }
  } else {
    // in case of relative paths we need to try all paths that
    // user has specified
    if (!path.extname(target)) {
      for (let i = 0; i < props.paths.length; i++) {
        for (const extension of props.extensions) {
          const res = tryCSSModule(path.join(props.paths[i], target + extension), props);
          if (res) return { path: res, success: true };
        }
      }
    } else {
      // with extensions we try only paths
      for (let i = 0; i < props.paths.length; i++) {
        const found = tryCSSModule(path.join(props.paths[i], target), props);
        if (found) {
          return { path: found, success: true };
        }
      }
    }
  }

  return { success: false };
}
