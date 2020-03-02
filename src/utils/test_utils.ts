import * as appRoot from 'app-root-path';
import * as fs from 'fs-extra';
import * as path from 'path';
import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { Context, createContext } from '../core/context';
import { createModule, IModule } from '../moduleResolver/module';
import { PackageType, createPackage, IPackage } from '../moduleResolver/package';
import { ensureFuseBoxPath, fastHash, path2RegexPattern } from './utils';

const utils = require('./utils');
declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R, T> {
      toMatchFilePath(path: string): R;
      toMatchJSONSnapshot(): R;
    }
  }
}

expect.extend({
  toMatchFilePath(actualPath, expectedPath) {
    actualPath = ensureFuseBoxPath(actualPath);
    expectedPath = ensureFuseBoxPath(expectedPath);

    const exp = path2RegexPattern(expectedPath);
    const isMatched = exp.test(actualPath);
    return {
      pass: isMatched,
      message: () => `Expected path matching ${exp}, but got: ${actualPath}`,
    };
  },
});

export interface IMockModuleProps {
  config?: IPublicConfig;
  moduleProps?: {
    absPath?: string;
    extension?: string;
    fuseBoxPath?: string;
  };
  packageProps?: {
    isDefaultPackage?: boolean;
    name?: string;
  };
}
export interface IMockModuleResponse {
  ctx: Context;
  module: IModule;
  pkg: IPackage;
}
export function mockModule(props: IMockModuleProps) {
  const ctx = createTestContext(props.config || {});
  const moduleProps = props.moduleProps || {};
  const packageProps = props.packageProps || {};

  const pkg = createPackage({
    meta: {
      name: packageProps.name || 'default',
      packageRoot: __dirname,
    },
    type: packageProps.isDefaultPackage ? PackageType.USER_PACKAGE : PackageType.EXTERNAL_PACKAGE,
  });

  const module = createModule({ absPath: moduleProps.absPath || __filename, ctx: ctx, pkg });
  for (const key in moduleProps) {
    module[key] = moduleProps[key];
  }
  return {
    ctx,
    module,
    pkg,
  };
}

export function throttle(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve(ms);
    }, ms);
  });
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

export function createTestContext(config?: IPublicConfig, type?: EnvironmentType) {
  config = config || {};
  config.watcher = false;
  config.hmr = false;
  config.entry ? config.entry : (config.entry = __filename);
  return createContext({ envType: EnvironmentType.DEVELOPMENT, publicConfig: config, scriptRoot: __dirname });
}

export function mockWriteFile() {
  const scope = {
    ensureDir: [],
    fileReads: [],
    files: {},
    removedFolders: [],
    written: [],
  };
  const originalReadFile = utils.readFile;
  let originalFunction = utils.writeFile;
  let originalEnsureDir = utils.ensureDir;
  const originalFileExists = utils.fileExists;
  const originalFileStat = utils.fileStat;
  const originalRemoveFolder = utils.removeFolder;

  utils['writeFile'] = (name, contents) => {
    scope.files[name] = { contents, stat: { mtime: new Date() } };
    scope.written.push({ contents: contents, name: name });
  };

  utils['ensureDir'] = userPath => {
    scope.ensureDir.push(userPath);
  };

  utils['fileExists'] = path => {
    return scope.files[path] !== undefined;
  };

  utils['fileStat'] = path => {
    if (scope.files[path]) {
      return scope.files[path].stat || {};
    }
  };

  utils['removeFolder'] = path => {
    scope.removedFolders.push(path);
  };

  utils['readFile'] = path => {
    scope.fileReads.push(path);
    return scope.files[path] && scope.files[path].contents;
  };

  return {
    addFile(path: string, contents) {
      scope.files[path] = { contents, stat: { mtime: new Date() } };
    },
    getEnsureDir() {
      return scope.ensureDir;
    },
    getFileReads() {
      return scope.fileReads;
    },
    deleteFile: (path: string) => {
      Object.keys(scope.files).forEach(key => {
        if (key.indexOf(path) > -1) {
          delete scope.files[key];
        }
      });
    },
    findFile: (pattern): { name: string; contents: string; stat: any } => {
      const re = path2RegexPattern(pattern);
      for (const key in scope.files) {
        const item = scope.files[key];
        if (re.test(key)) {
          return { contents: item.contents, name: key, stat: item.stat };
        }
      }
    },
    findFiles: (pattern): Array<{ name: string; contents: string; stat: any }> => {
      const re = path2RegexPattern(pattern);
      const found = [];
      for (const key in scope.files) {
        const item = scope.files[key];
        if (re.test(key)) {
          found.push({ contents: item.contents, name: key, stat: item.stat });
        }
      }
      return found;
    },
    findRemovedFolder: pattern => {
      const re = path2RegexPattern(pattern);
      for (const key in scope.removedFolders) {
        const f = scope.removedFolders[key];
        if (re.test(f)) {
          return true;
        }
      }
    },
    flush: () => {
      scope.fileReads = [];
      scope.removedFolders = [];
      scope.written = [];
      scope.files = {};
      scope.ensureDir = [];
    },
    getFileAmount: () => Object.keys(scope.files).length,
    getFiles: () => scope.files,
    getRemovedFolders: () => {
      return scope.removedFolders;
    },
    getWrittenFiles: (index?: number) => (index !== undefined ? scope.written[index] : scope.written),
    unmock: () => {
      utils['filesStat'] = originalFileStat;
      utils['writeFile'] = originalFunction;
      utils['ensureDir'] = originalEnsureDir;
      utils['fileExists'] = originalFileExists;
      utils['readFile'] = originalReadFile;
      utils['removeFolder'] = originalRemoveFolder;
    },
  };
}
export function testUtils() {}

expect.extend({
  toMatchJSONSnapshot(str: string) {
    const testName = this['currentTestName'];
    const testPath = this['testPath'];

    const root = path.dirname(testPath);

    const snapshotFolder = path.join(root, '__snapshots__');
    if (!fs.existsSync(snapshotFolder)) {
      fs.mkdirSync(snapshotFolder);
    }

    const testId = fastHash(testPath + testName);

    const filePath = path.join(snapshotFolder, path.basename(testPath) + '.shapshot.json');
    let json = {};
    if (fs.existsSync(filePath)) {
      json = require(filePath);
    }

    if (json[testId]) {
      expect(json[testId]).toEqual(str);

      return {
        pass: true,
        message: () => '',
      };
    } else {
      json[testId] = str;
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    }
    return {
      pass: true,
      message: () => '',
    };
  },
});
