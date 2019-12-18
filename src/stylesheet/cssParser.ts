import * as path from 'path';
import { fileExists, readFile } from '../utils/utils';

const IMPORT_REGEX = /@(?:import|value)[^"']+["']([^"']+)/g;

export interface ICSSDependencyExtractorProps {
  collectDependencies?: boolean;
  entryAbsPath?: string;
  entryContents?: string;
  sassStyle?: boolean;
  tryExtensions?: Array<string>;
  onURL?: (filePath: string) => string;
}

/**
 * Reading imports based on a simple Regular expression
 * It's common for any css processor
 * @param input
 */
export function readCSSImports(input: string): Array<string> {
  let match = undefined;
  const result: Array<string> = [];
  while ((match = IMPORT_REGEX.exec(input))) {
    result.push(match[1]);
  }
  return result;
}

export interface CCSExtractorContext {
  files: Array<string>;
}

/**
 * Check if file exists and wasn't added to the scope
 * @param target
 * @param props
 * @param context
 */
function checkFile(target: string, props: ICSSDependencyExtractorProps, context: CCSExtractorContext) {
  if (fileExists(target) && context.files.indexOf(target) < 0) {
    context.files.push(target);
    const newProps = { ...props, entryAbsPath: target, entryContents: readFile(target) };
    collectCSSDependencies(newProps, context);
    return true;
  }
}

/**
 * COllecting local references, we aren't intersted in node_modules
 * since those won't affect the watcher
 * @param target
 * @param props
 * @param context
 */
function tryTarget(target: string, props: ICSSDependencyExtractorProps, context: CCSExtractorContext) {
  if (/node_modules/.test(target)) {
    return false;
  }
  if (checkFile(target, props, context)) {
    return true;
  } else {
    if (props.sassStyle) {
      // we're going to give it last check to get resolved with underscore
      let fname = path.basename(target);
      // if a filename doesn't have _ we need to try it with _ for sass cases
      if (!/^_/.test(fname)) {
        const pathWithUnderScore = path.join(path.dirname(target), '_' + fname);
        if (checkFile(pathWithUnderScore, props, context)) {
          return true;
        }
      }
    }
  }
}

/**
 * Collects dependencies (without node_module references)
 * This is used only by watcher to understand which dependencies a file has, in order to break the cache ( if needed for the corresponding file that requires the parent css)
 * @param props
 * @param context
 */
function collectCSSDependencies(props: ICSSDependencyExtractorProps, context: CCSExtractorContext) {
  const root = path.dirname(props.entryAbsPath);
  const files = readCSSImports(props.entryContents);
  files.forEach(fpath => {
    let ext = path.extname(fpath);
    if (!ext && props.tryExtensions) {
      for (let i = 0; i < props.tryExtensions.length; i++) {
        const ext = props.tryExtensions[i];
        let target = path.isAbsolute(fpath) ? `${fpath}${ext}` : `${path.join(root, fpath)}${ext}`;
        if (tryTarget(target, props, context)) break;
      }
    } else {
      let target = path.isAbsolute(fpath) ? fpath : path.join(root, fpath);
      tryTarget(target, props, context);
    }
  });
}
/**
 * - Collects dependencies
 * - Replaces urls if needed
 * @param props
 */
export function cssParser(props: ICSSDependencyExtractorProps): CCSExtractorContext {
  const context: CCSExtractorContext = {
    files: [],
  };

  if (props.collectDependencies) {
    collectCSSDependencies(props, context);
  }
  return context;
}
