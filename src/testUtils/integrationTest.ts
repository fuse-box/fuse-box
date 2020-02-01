import * as fs from 'fs';
import { writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { Context, createContext } from '../core/context';
import { bundleDev, IBundleDevResponse } from '../development/bundleDev';
import { env } from '../env';
import { ensureDir, fastHash, fileExists, readFile } from '../utils/utils';
export interface ITestBrowserResponse {
  __fuse: any;
  entry: any;
  errors: Array<any>;
}
export function createDevSandbox(props: { ctx: Context; response: IBundleDevResponse; workspace: ITestWorkspace }) {
  const self = {
    runBundleInBrowser: async (): Promise<ITestBrowserResponse> => {
      const app = readFile(path.join(props.workspace.distRoot, 'app.js'));
      const window: any = {};
      const __fuse: any = new Proxy(
        {},
        {
          get: (obj, prop) => {
            return window.__fuse[prop];
          },
        },
      );
      var fn = new Function('window', '__fuse', app);
      const errors = [];
      try {
        fn(window, __fuse);
      } catch (e) {
        errors.push(e);
      }
      return new Promise((resolve, reject) => {
        return resolve({
          __fuse,
          entry: __fuse.r(1),
          errors,
        });
      });
    },
  };
  return self;
}

export type ITestWorkspace = ReturnType<typeof createTestWorkspace>;

function getCacheWorkspace(workspace: ITestWorkspace) {
  const files = fs.readdirSync(workspace.cacheFolder);

  const cacheFolder = path.join(workspace.cacheFolder, files[0]);
  const metaFile = path.join(cacheFolder, 'meta.json');
  const cacheFilesFolder = path.join(cacheFolder, 'files');

  return {
    getCachedFiles: () => {
      const files = fs.readdirSync(cacheFilesFolder);
      return files.map(i => path.join(cacheFilesFolder, i));
    },
    getMetaFile: () => {
      return JSON.parse(readFile(metaFile));
    },
  };
}
export function createTestWorkspace(props: {
  cache?: boolean;
  files: Record<string, string>;
  modules?: Record<string, Record<string, string>>;
}) {
  const sourceFolder = fastHash(Math.random() + '-' + new Date().getTime());
  const rootDir = path.join(env.APP_ROOT, '.tmp', sourceFolder);
  const sourceDir = path.join(rootDir, 'src');
  const distRoot = path.join(rootDir, 'dist');
  let cacheFolder;
  if (props.cache) {
    cacheFolder = path.join(rootDir, '.cache');
  }

  // creating modules if needed
  const modulesRoot = path.join(rootDir, 'modules');
  let modules = [];
  if (props.modules) {
    for (const name in props.modules) {
      for (const filename in props.modules[name]) {
        const filePath = path.join(modulesRoot, name, filename);
        ensureDir(path.dirname(filePath));
        writeFileSync(filePath, props.modules[name][filename]);
      }
    }
    modules.push(modulesRoot);
  }

  const webIndex = path.join(distRoot, 'index.html');

  // creating user files
  ensureDir(sourceDir);
  for (const filename in props.files) {
    const filePath = path.join(sourceDir, filename);
    ensureDir(path.dirname(filePath));
    writeFileSync(filePath, props.files[filename]);
  }
  const self = {
    cacheFolder,
    distRoot,
    modules,
    rootDir,
    sourceDir,
    webIndex,
    destroy: () => {
      fsExtra.removeSync(rootDir);
    },
    getCacheWorkspace: () => {
      return getCacheWorkspace(self);
    },
    removeFile: filename => {
      const filePath = path.join(sourceDir, filename);
      if (fileExists(filePath)) {
        fsExtra.removeSync(filePath);
      }
    },
    removeModuleFile: filename => {
      const filePath = path.join(rootDir, 'modules', filename);
      if (fileExists(filePath)) {
        fsExtra.removeSync(filePath);
      }
    },
    setFile: (filename: string, contents: string) => {
      const filePath = path.join(sourceDir, filename);
      ensureDir(path.dirname(filePath));
      writeFileSync(filePath, contents);
    },
    setModuleFile: (filename: string, contents: string) => {
      const filePath = path.join(rootDir, 'modules', filename);
      ensureDir(path.dirname(filePath));
      writeFileSync(filePath, contents);
    },
  };
  return self;
}
export function createIntegrationTest(props: {
  config?: IPublicConfig;
  envType: EnvironmentType;
  workspace: ITestWorkspace;
}) {
  const customConfig: IPublicConfig = props.config || {};
  const { workspace } = props;

  const config: IPublicConfig = {
    cache: { enabled: !!workspace.cacheFolder, root: workspace.cacheFolder },
    devServer: false,
    logging: { level: 'disabled' },
    modules: workspace.modules,
    watcher: false,
    webIndex: { publicPath: './' },
    ...customConfig,
  };

  const ctx = createContext({
    envType: props.envType,
    publicConfig: config,
    runProps: { bundles: { app: 'app.js', distRoot: workspace.distRoot } },
    scriptRoot: workspace.rootDir,
  });

  return {
    ctx,
    runDev: async () => {
      const response = await bundleDev({ ctx });

      return createDevSandbox({ ctx, response, workspace: props.workspace });
    },
  };
}
