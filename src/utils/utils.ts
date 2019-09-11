import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { env } from '../env';
import * as prettyTime from 'pretty-time';
import * as offsetLinesModule from 'offset-sourcemap-lines';
const CACHED_PATHS = new Map<string, RegExp>();

export function path2Regex(path: string) {
  if (CACHED_PATHS.get(path)) {
    return CACHED_PATHS.get(path);
  }
  path = path.replace(/(\.|\/)/, '\\$1');

  const re = new RegExp(path);
  CACHED_PATHS.set(path, re);
  return re;
}

export function matchAll(regex: RegExp, str: string, cb: (matches) => void) {
  let matches;
  while ((matches = regex.exec(str))) {
    cb(matches);
  }
}

export function removeFolder(userPath) {
  fsExtra.removeSync(userPath);
}

export function beautifyBundleName(absPath: string) {
  absPath = absPath.replace(/(\.\w+)$/i, '');
  const items = absPath.split(/(\/|\\)/);
  const l = items.length;
  const [a, b] = [items[l - 1], items[l - 3]];

  let suggested = b ? `${b}-${a}` : a;
  if (suggested.length > 20) {
    suggested = suggested.slice(suggested.length, 20);
  }
  return suggested.toLowerCase();
}

export function offsetLines(obj: any, amount: number) {
  return offsetLinesModule(obj, amount);
}

export function isRegExp(input: any): boolean {
  return !!(input && typeof input.test === 'function');
}

export function createRequireConst(name: string, variable?: string) {
  return `var ${variable ? variable : name} = require("${name}");`;
}
export function createRequireConstWithObject(name: string, variable: string, obj?: string) {
  return `var ${variable ? variable : name} = require("${name}").${obj};`;
}
export function createStringConst(name: string, value: string) {
  return `const ${name} = ${JSON.stringify(value)};`;
}

export function createVarString(name: string, value: string) {
  return `var ${name} = ${JSON.stringify(value)};`;
}
export function ensurePublicExtension(url: string) {
  let ext = path.extname(url);
  if (ext === '.ts') {
    url = replaceExt(url, '.js');
  }
  if (ext === '.tsx') {
    url = replaceExt(url, '.jsx');
  }
  return url;
}

export function parseVersion(version: string) {
  const re = /v?(\d+)/g;
  let matcher;
  const versions = [];
  while ((matcher = re.exec(version))) {
    versions.push(parseInt(matcher[1]));
  }
  return versions;
}

export function replaceExt(npath: string, ext): string {
  if (!npath) {
    return npath;
  }

  if (/\.[a-z0-9]+$/i.test(npath)) {
    return npath.replace(/\.[a-z0-9]+$/i, ext);
  } else {
    return npath + ext;
  }
}

export function extractFuseBoxPath(homeDir: string, targetPath: string) {
  homeDir = ensureFuseBoxPath(homeDir);
  targetPath = ensureFuseBoxPath(targetPath);
  let result = targetPath.replace(homeDir, '');
  if (result[0] === '/') {
    result = result.slice(1);
  }
  return result;
}

export function fileExists(file: string) {
  return fs.existsSync(file);
}

export function readFile(file: string) {
  return fs.readFileSync(file).toString();
}

export function readFileAsBuffer(file: string) {
  return fs.readFileSync(file);
}

export function removeFile(file: string) {
  return fs.unlinkSync(file);
}
export async function copyFile(file: string, target: string) {
  return fsExtra.copy(file, target);
}
export function isObject(obj: any) {
  return typeof obj === 'object';
}

export function pathJoin(...args) {
  return path.join(...args);
}
export function getExtension(file: string) {
  return path.extname(file);
}

export function ensureDir(dir: string) {
  fsExtra.ensureDirSync(dir);
  return dir;
}

export function fileStat(file: string) {
  return fs.statSync(file);
}
export function makeFuseBoxPath(homeDir: string, absPath: string) {
  return homeDir && ensurePublicExtension(extractFuseBoxPath(homeDir, absPath));
}

export function measureTime(group?: string) {
  let startTime = process.hrtime();
  return {
    end: () => {
      return prettyTime(process.hrtime(startTime));
    },
  };
}

export function cleanExistingSourceMappingURL(contents: string) {
  return contents.replace(/\/*#\s*sourceMappingURL=\s*([^\s]+)\s*\*\//, '');
}

export function findReplace(str: string, re: RegExp, fn: (args) => string) {
  return str.replace(re, (...args) => {
    return fn(args);
  });
}

export function path2RegexPattern(input: undefined | string | RegExp): RegExp {
  if (!input) {
    return;
  }

  if (typeof input === 'string') {
    let r = '';
    for (let i = 0; i < input.length; i++) {
      switch (input[i]) {
        case '.':
          r += '\\.';
          break;
        case '/':
          r += '(\\/|\\\\)';
          break;
        case '\\':
          r += '\\\\';
          break;
        case '*':
          r += '.*';
          break;
        default:
          r += input[i];
      }
    }
    return new RegExp(r);
  }
  return input;
}

export function ensureUserPath(userPath: string, root?: string) {
  if (!path.isAbsolute(userPath)) {
    userPath = path.join(root, userPath);
  }
  userPath = path.normalize(userPath);
  let dir = path.dirname(userPath);

  fsExtra.ensureDirSync(dir);
  return userPath;
}

export type Concat = {
  add(fileName: string | null, content: string | Buffer, sourceMap?: string): void;
  content: Buffer;
  sourceMap: string;
};
export type ConcatModule = {
  new (generateSourceMap: boolean, outputFileName: string, seperator: string): Concat;
};
export const Concat: ConcatModule = require('fuse-concat-with-sourcemaps');

export function createConcat(generateSourceMap: boolean, outputFileName: string, seperator: string): Concat {
  return new Concat(generateSourceMap, outputFileName, seperator);
}

export function ensureAbsolutePath(userPath: string, root: string) {
  if (!path.isAbsolute(userPath)) {
    return path.join(root, userPath);
  }
  return userPath;
}

export function getPathRelativeToConfig(props: { fileName?: string; dirName: string; ensureDirExist?: boolean }) {
  let target = props.fileName ? path.dirname(props.fileName) : props.dirName;
  const fileName = props.fileName && path.basename(props.fileName);
  if (!path.isAbsolute(target)) {
    target = path.join(env.SCRIPT_PATH, target);
  }
  if (props.ensureDirExist) {
    const baseDir = path.dirname(target);
    ensureDir(baseDir);
  }
  return fileName ? path.join(target, fileName) : target;
}

export function ensureFuseBoxPath(input: string) {
  return input.replace(/\\/g, '/').replace(/\/$/, '');
}

export function joinFuseBoxPath(...any): string {
  let includesProtocol = any[0].includes('://');
  let joinedPath = !includesProtocol
    ? path.join(...any)
    : any[0].replace(/([^/])$/, '$1/') + path.join(...any.slice(1));
  return ensureFuseBoxPath(joinedPath);
}

export async function writeFile(name: string, contents) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(name));
    fs.writeFile(name, contents, err => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

export function fastHash(text: string): string {
  let hash = 0;
  if (text.length == 0) return '';
  for (let i = 0; i < text.length; i++) {
    let char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  let result = hash.toString(16).toString();
  if (result.charAt(0) === '-') {
    result = result.replace(/-/, '0');
  }
  return result;
}
