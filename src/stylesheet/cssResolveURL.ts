import * as path from 'path';
import { IStyleSheetProps } from '../config/IStylesheetProps';
import { FONT_EXTENSIONS, IMAGE_EXTENSIONS } from '../config/extensions';
import { Context } from '../core/context';
import { fastHash, fileExists, joinFuseBoxPath } from '../utils/utils';
import { replaceCSSMacros } from './cssResolveModule';

export interface ICSSResolveURLProps {
  contents: string;
  ctx: Context;
  filePath: string;
  options: IStyleSheetProps;
}

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
  destination: string;
  original: string;
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
  if (extension === '.ico') {
    return 'ico';
  }
  if (extension === '.pdf') {
    return 'documents';
  }
}

export function resolveCSSResource(target, props: ICSSResolveURLProps): IURLReplaced {
  const root = path.dirname(props.filePath);

  // getting rid of url#something or url?time=12
  target = target.replace(/[?\#].*$/, '');
  if (props.options.macros) {
    target = replaceCSSMacros(target, props.options.macros);
  }

  if (!path.isAbsolute(target)) {
    target = path.join(root, target);
  }

  if (fileExists(target)) {
    let fileGroup: string;

    // setting file group

    if (props.options.groupResourcesFilesByType) {
      fileGroup = defineResourceGroup(path.extname(target).toLowerCase());
    }

    let name = fastHash(target) + path.extname(target);
    if (fileGroup) {
      name = fileGroup + '/' + name;
    }
    const resourceConfig = props.ctx.config.getResourceConfig(props.options);

    const resourcePublicRoot = resourceConfig.resourcePublicRoot;

    const publicPath = joinFuseBoxPath(resourcePublicRoot, name);
    const destination = path.join(resourceConfig.resourceFolder, name);

    // we don't want to copy a file if that was copied before
    if (props.options.ignoreChecksForCopiedResources) {
      props.ctx.taskManager.copyFile(target, destination);
    } else {
      if (!fileExists(destination)) {
        props.ctx.taskManager.copyFile(target, destination);
      }
    }
    return { destination, original: target, publicPath };
  }
}

export interface ICSSResolveURLResult {
  contents: string;
  replaced: Array<IURLReplaced>;
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
    // apply macros before checking for special words
    if (props.options.macros) {
        value = replaceCSSMacros(value, props.options.macros);
    }
    // preserving svg filters, http links, data:image (base64), sass and less variables
    if (/^#|data:|http|\$|@/.test(value)) {
      // return those as is
      return match;
    }
    const result = resolveCSSResource(value, props);
    if (result) {
      replaced.push(result);
      return `url("${result.publicPath}")`;
    }
    props.ctx.log.warn('Failed to resolve $value in $file:$line', {
      file: props.filePath,
      line: mapErrorLine(contents, offset),
      value: value,
    });
    return match;
  });
  return { contents, replaced };
}
