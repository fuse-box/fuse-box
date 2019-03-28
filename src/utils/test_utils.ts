import * as fs from 'fs-extra';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { ensureFuseBoxPath, path2RegexPattern } from './utils';
import { Context, createContext } from '../core/Context';
import { createDefaultPackage } from '../core/application';
import { createModule, IModuleProps, Module } from '../core/Module';
import { assemble } from '../main/assemble';
import { IConfig } from '../core/interfaces';
import { Package, createPackage } from '../core/Package';
const utils = require('./utils');
declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      toMatchFilePath(path: string): R;
    }
  }
}

expect.extend({
  toMatchFilePath(expectedPath, comparedPath) {
    expectedPath = ensureFuseBoxPath(expectedPath);
    comparedPath = ensureFuseBoxPath(comparedPath);
    comparedPath = comparedPath
      .split('.')
      .join('\\.')
      .split('/')
      .join('\\/');
    const exp = new RegExp(comparedPath);
    const isMatched = exp.test(expectedPath);
    return {
      pass: isMatched,
      message: () => `Expected ${exp} to match ${expectedPath}`,
    };
  },
});

export interface IMockModuleProps {
  config?: IConfig;
  packageProps?: {
    name?: string;
    isDefaultPackage?: boolean;
  };
  moduleProps?: {
    absPath?: string;
    extension?: string;
    fuseBoxPath?: string;
  };
}
export interface IMockModuleResponse {
  module: Module;
  ctx: Context;
  pkg: Package;
}
export function mockModule(props: IMockModuleProps): IMockModuleResponse {
  const ctx = createContext(props.config || {});
  const moduleProps = props.moduleProps || {};
  const packageProps = props.packageProps || {};
  const pkg = createPackage({
    ctx: ctx,
    meta: {
      packageRoot: __dirname,
      name: packageProps.name || 'default',
    },
  });
  if (packageProps.isDefaultPackage) {
    pkg.isDefaultPackage = true;
  }

  return {
    module: createModule(
      {
        ctx: ctx,
        absPath: moduleProps.absPath || '/',
        extension: moduleProps.extension || '.js',
        fuseBoxPath: moduleProps.fuseBoxPath || '/',
      },
      pkg,
    ),
    ctx: ctx,
    pkg: pkg,
  };
}

export function throttle(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(ms);
    }, ms);
  });
}
export function createAssembleHellper(folder: string) {
  function createProjectContext(folder: string, opts?: IConfig): Context {
    opts = opts || {};
    return createContext({
      ...{
        modules: [path.resolve(__dirname, 'cases/modules/')],
        homeDir: path.resolve(__dirname, 'cases/projects/', folder),
      },
      ...opts,
    });
  }

  return function withEntry(
    opts: IConfig,
    entry: string,
  ): {
    ctx: Context;
    packages: Array<Package>;
    getDefaultPackage: () => Package;
    getDefaultModules: () => Array<Module>;
  } {
    const ctx = createProjectContext(folder, opts);
    const packages = assemble(ctx, entry);
    return {
      ctx,
      packages,
      getDefaultPackage: () => packages.find(p => p.isDefaultPackage),
      getDefaultModules: () => {
        const pkg = packages.find(p => p.isDefaultPackage);
        return pkg.modules;
      },
    };
  };
}

function createFiles(dir: string, files: any) {
  for (let name in files) {
    const content = files[name];
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
  }
}

export function removeFolder(userPath) {
  fs.removeSync(userPath);
}

export function createRealNodeModule(name: string, packageJSON, files: { [key: string]: string }): string {
  const path2Module = path.join(appRoot.path, 'node_modules', name);
  if (fs.existsSync(path2Module)) {
    removeFolder(path2Module);
  }
  fs.ensureDirSync(path2Module);
  const s = name.split('/');

  packageJSON.name = s[s.length - 1];
  files['package.json'] = JSON.stringify(packageJSON);

  createFiles(path2Module, files);
  return path2Module;
}

export function mockDefaultModule(ctx: Context, props?: IModuleProps) {
  const pkg = createDefaultPackage(ctx);
  let p = { ctx: ctx, absPath: '/', extension: '.js', fuseBoxPath: 'index.js' };
  if (props) {
    p = { ...p, ...props };
  }
  return createModule(p, pkg);
}

export function mockWriteFile() {
  const scope = {
    written: [],
    files: {},
    ensureDir: [],
    fileReads: [],
  };
  const originalReadFile = utils.readFile;
  let originalFunction = utils.writeFile;
  let originalEnsureDir = utils.ensureDir;
  const originalFileExists = utils.fileExists;

  utils['writeFile'] = (name, contents) => {
    scope.files[name] = contents;
    scope.written.push({ name: name, contents: contents });
  };

  utils['ensureDir'] = userPath => {
    scope.ensureDir.push(userPath);
  };

  utils['fileExists'] = path => {
    return scope.files[path];
  };

  utils['readFile'] = path => {
    scope.fileReads.push(path);
    return scope.files[path];
  };

  return {
    findFile: (pattern): { name: string; contents: string } => {
      const re = path2RegexPattern(pattern);
      for (const key in scope.files) {
        if (re.test(key)) {
          return { name: key, contents: scope.files[key] };
        }
      }
    },
    getFileReads() {
      return scope.fileReads;
    },
    getEnsureDir() {
      return scope.ensureDir;
    },
    getFileAmount: () => Object.keys(scope.files).length,
    getWrittenFiles: (index?: number) => (index !== undefined ? scope.written[index] : scope.written),
    getFiles: () => scope.files,
    deleteFile: (path: string) => {
      Object.keys(scope.files).forEach(key => {
        if (key.indexOf(path) > -1) {
          delete scope.files[key];
        }
      });
    },
    addFile(path: string, contents) {
      scope.files[path] = contents;
    },
    unmock: () => {
      utils['writeFile'] = originalFunction;
      utils['ensureDir'] = originalEnsureDir;
      utils['fileExists'] = originalFileExists;
      utils['readFile'] = originalReadFile;
    },
    flush: () => {
      scope.fileReads = [];
      scope.written = [];
      scope.files = {};
      scope.ensureDir = [];
    },
  };
}
