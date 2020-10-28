import * as fs from 'fs';
import { writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { ICacheMeta } from '../cache/cache';
import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { IRunResponse } from '../core/IRunResponse';
import { Context, createContext } from '../core/context';
import { preflightFusebox } from '../core/helpers/preflightFusebox';
import { bundleDev } from '../development/bundleDev';
import { env } from '../env';
import { bundleProd } from '../production/bundleProd';
import { ensureDir, fastHash, fileExists, listDirectory, path2RegexPattern, readFile } from '../utils/utils';
import { createTestBrowserEnv, ITestBrowserResponse } from './browserEnv/testBrowserEnv';
import { createTestServerEnv, ITestServerResponse } from './serverEnv/testServerEnv';
import { IRunProps } from '../config/IRunProps';

const MODULES_PATH = 'node_modules';

export async function testServer(props: {
  config?: IPublicConfig;
  type?: EnvironmentType;
  workspace: ITestWorkspace;
}): Promise<ITestServerResponse> {
  const userConfig = props.config || {};
  const test = createIntegrationTest({
    config: {
      cache: false,
      entry: path.join(props.workspace.sourceDir, 'index.ts'),
      target: 'server',
      ...userConfig,
    },
    envType: props.type ? props.type : EnvironmentType.DEVELOPMENT,
    workspace: props.workspace,
  });

  const response = props.type === EnvironmentType.DEVELOPMENT ? await test.runDev() : await test.runProd();
  return response.runServer();
}

export async function testBrowser(props: {
  config?: IPublicConfig;
  type?: EnvironmentType;
  workspace: ITestWorkspace;
}): Promise<ITestBrowserResponse> {
  const userConfig = props.config || {};
  const test = createIntegrationTest({
    config: {
      cache: false,
      entry: path.join(props.workspace.sourceDir, 'index.ts'),
      target: 'browser',
      ...userConfig,
    },
    envType: props.type ? props.type : EnvironmentType.DEVELOPMENT,
    workspace: props.workspace,
  });

  const response = props.type === EnvironmentType.DEVELOPMENT ? await test.runDev() : await test.runProd();
  return response.runBrowser();
}

export const EnvironmentTypesTestable = [EnvironmentType.DEVELOPMENT, EnvironmentType.PRODUCTION];

export function createDevSandbox(props: { ctx: Context; response: IRunResponse; workspace: ITestWorkspace }) {
  const self = {
    runBrowser: () => createTestBrowserEnv(props.workspace, props.response),
    runServer: () => createTestServerEnv(props.workspace, props.response)(),
  };
  return self;
}

export type ITestWorkspace = ReturnType<typeof createTestWorkspace>;

function createTestMeta(metaFile: string) {
  const meta: ICacheMeta = JSON.parse(readFile(metaFile));
  return {
    meta: meta,
    findModule: (target: string) => {
      const rex = path2RegexPattern(target);
      for (const id in meta.modules) {
        const m = meta.modules[id];

        if (rex.test(m.absPath)) return m;
      }
    },
    writeMeta: async (meta: any) => {
      return writeFileSync(metaFile, meta);
    },
  };
}
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
      return createTestMeta(metaFile);
    },
  };
}

export function createDistWorkspace(workspace: ITestWorkspace) {
  const files = listDirectory(workspace.distRoot);
  return {
    findFile: (re: RegExp) => {
      return files.find(item => re.test(item));
    },
    getAppContents: () => {
      const app = files.find(item => /app\.js$/.test(item));
      if (!app) throw new Error("App file wasn't found");
      return readFile(app);
    },
    getFiles: (): Array<string> => {
      return files;
    },
  };
}
export function createTestWorkspace(props: {
  files: Record<string, string>;
  modules?: Record<string, Record<string, string>>;
}) {
  const sourceFolder = fastHash(Math.random() + '-' + new Date().getTime());
  const rootDir = path.join(env.APP_ROOT, '.tmp', sourceFolder);
  const sourceDir = path.join(rootDir, 'src');
  const distRoot = path.join(rootDir, 'dist');
  let cacheFolder = path.join(rootDir, '.cache');

  // creating modules if needed
  const modulesRoot = path.join(rootDir, MODULES_PATH);
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
    getDist: () => createDistWorkspace(self),
    removeFile: filename => {
      const filePath = path.join(sourceDir, filename);
      if (fileExists(filePath)) {
        fsExtra.removeSync(filePath);
      }
    },
    removeModuleFile: filename => {
      const filePath = path.join(rootDir, MODULES_PATH, filename);
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
      const filePath = path.join(rootDir, MODULES_PATH, filename);
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
  runProps?: IRunProps;
}) {
  const customConfig: IPublicConfig = props.config || {};
  const runProps: IRunProps = props.runProps || {};
  const { workspace } = props;

  const config: IPublicConfig = {
    devServer: false,
    logging: { level: 'disabled' },
    modules: workspace.modules,
    watcher: false,
    webIndex: { publicPath: './' },
    ...customConfig,
  };

  if (typeof config.cache === 'object') {
    if (config.cache.enabled) {
      config.cache.root = workspace.cacheFolder;
    }
  } else if (config.cache === true) {
    config.cache = { enabled: true, root: workspace.cacheFolder };
  }

  const ctx = createContext({
    envType: props.envType,
    publicConfig: config,
    runProps: { bundles: { app: 'app.js', distRoot: workspace.distRoot }, uglify: false, ...runProps },
    scriptRoot: workspace.rootDir,
  });

  return {
    ctx,
    runDev: async () => {
      preflightFusebox(ctx);
      const response = await bundleDev({ ctx });
      return createDevSandbox({ ctx, response, workspace: props.workspace });
    },
    runProd: async () => {
      preflightFusebox(ctx);

      const response = await bundleProd(ctx);
      return createDevSandbox({ ctx, response, workspace: props.workspace });
    },
  };
}
