import * as fs from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';

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

export function replaceExt(npath, ext): string {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
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
export function getExtension(file: string) {
  return path.extname(file);
}

export function ensureDir(dir: string) {
  fsExtra.ensureDirSync(dir);
  return dir;
}
export function makeFuseBoxPath(homeDir: string, absPath: string) {
  return homeDir && ensurePublicExtension(extractFuseBoxPath(homeDir, absPath));
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

export function ensureAbsolutePath(userPath: string, root: string) {
  if (!path.isAbsolute(userPath)) {
    return path.join(root, userPath);
  }
  return userPath;
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
