import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { Context } from '../core/Context';
import { ensureAbsolutePath, fastHash, fileExists, joinFuseBoxPath } from '../utils/utils';
import { replaceCSSMacros } from './cssResolveModule';

export interface ICSSResolveURLProps {
  filePath: string;
  contents: string;
  options: IStyleSheetProps;
  ctx: Context;
}

const FONT_EXTENSIONS = ['.ttf', '.otf', '.woff', '.woff2', 'eot'];
const IMAGE_EXTENSIONS = ['.png', '.jpeg', '.jpg', '.gif', '.bmp'];
const Expression = /url\(([^\)]+)\)/gm;

function extractValue(input: string) {
  const first = input.charCodeAt(0);
  const last = input.charCodeAt(input.length - 1);
  if (first === 39 || first === 34) {
    input = input.slice(1);
  }
  if (last === 39 || last === 34) {
    input = input.slice(0, -1);
  }
  if (/data:/.test(input)) {
    return;
  }
  return input;
}

export interface IURLReplaced {
  original: string;
  destination: string;
  publicPath: string;
}

export function defineResourceGroup(extension) {
  if (IMAGE_EXTENSIONS.includes(extension)) {
    return 'images';
  }
  if (FONT_EXTENSIONS.includes(extension)) {
    return 'fonts';
  }
  if (extension === '.svg') {
    return 'svg';
  }
}

export function resolveCSSResource(target, props: ICSSResolveURLProps): IURLReplaced {
  const root = path.dirname(props.filePath);
  const config = props.ctx.config;

  if (props.options.macros) {
    target = replaceCSSMacros(target, props.options.macros);
  }

  if (!path.isAbsolute(target)) {
    target = path.join(root, target);
  }
  if (fileExists(target)) {
    let fileGroup: string;
    const shouldGroupByType =
      config.stylesheet.groupResourcesFilesByType === undefined ? true : config.stylesheet.groupResourcesFilesByType;
    // setting file group
    if (shouldGroupByType) {
      fileGroup = defineResourceGroup(path.extname(target).toLowerCase());
    }

    let name = fastHash(target) + path.extname(target);
    if (fileGroup) {
      name = fileGroup + '/' + name;
    }
    const resourcePublicRoot = config.getResourcePublicRoot();
    const publicPath = joinFuseBoxPath(resourcePublicRoot, name);
    let resourceFolder = props.ctx.config.getResourceFolder(props.ctx);

    const destination = path.join(resourceFolder, name);

    // we don't want to copy a file if that was copied before
    if (config.stylesheet.ignoreChecksForCopiedResources) {
      props.ctx.taskManager.copyFile(target, destination);
    } else {
      if (!fileExists(destination)) {
        props.ctx.taskManager.copyFile(target, destination);
      }
    }
    return { original: target, publicPath, destination };
  }
}

export interface ICSSResolveURLResult {
  replaced: Array<IURLReplaced>;
  contents: string;
}

export function mapErrorLine(contents: string, offset: number) {
  let line = 1;
  let leftOffset = 0;
  for (let i = 0; i <= offset; i++) {
    if (contents[i] === '\n') {
      leftOffset = 0;
      line++;
    } else {
      leftOffset++;
    }
  }
  return `${line}:${leftOffset}`;
}

export function cssResolveURL(props: ICSSResolveURLProps): ICSSResolveURLResult {
  let contents = props.contents;
  const replaced: Array<IURLReplaced> = [];
  contents = contents.replace(Expression, (match, data, offset, input_string) => {
    let value = extractValue(data);
    if (typeof value === 'undefined') {
      return match;
    }
    const result = resolveCSSResource(value, props);
    if (result) {
      replaced.push(result);
      return `url("${result.publicPath}")`;
    } else {
      props.ctx.log.warn('Failed to resolve $value in $file:$line', {
        value: value,
        file: props.filePath,
        line: mapErrorLine(contents, offset),
      });
    }
    return `url("${value}")`;
  });
  return { replaced, contents };
}
