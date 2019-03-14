import * as fs from 'fs-extra';
import * as path from 'path';
import * as appRoot from 'app-root-path';
import { ensureFuseBoxPath } from './utils';
import { Context, createContext } from '../core/Context';
import { createDefaultPackage } from '../core/application';
import { createModule, IModuleProps, Module } from '../core/Module';
import { assemble } from '../main/assemble';
import { IConfig } from '../core/interfaces';
import { Package, createPackage } from '../core/Package';

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

export function mockModule(props: {
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
}) {
  const ctx = createContext(props.config || {});
  const moduleProps = props.moduleProps || {};
  const packageProps = props.packageProps || {};
  const pkg = createPackage({
    ctx: ctx,
    meta: {
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
  let p = { ctx: ctx, absPath: '/', extension: '.js', fuseBoxPath: '/' };
  if (props) {
    p = { ...p, ...props };
  }
  return createModule(p, pkg);
}
