import { readFileSync, writeFileSync } from 'fs';
import * as fsExtra from 'fs-extra';
import * as path from 'path';
import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { Context, createContext } from '../core/context';
import { bundleDev, IBundleDevResponse } from '../development/bundleDev';
import { env } from '../env';
import { ensureDir, fastHash } from '../utils/utils';

export function createDevSandbox(ctx: Context, props: IBundleDevResponse) {
  const { bundleContext, bundles, entries, modules } = props;

  const self = {
    runBundleInBrowser: () => {
      const appBundle = bundles[0];
      console.log(appBundle.absPath);
      const code = readFileSync(appBundle.absPath).toString();

      const window = {};
      var res = new Function('window', code);
      res(window);
      console.log(window);
    },
  };
  return self;
}
export function createIntegrationTest(props: {
  config?: IPublicConfig;
  envType: EnvironmentType;
  files: Record<string, string>;
  modules?: Record<string, Record<string, string>>;
}) {
  const customConfig: IPublicConfig = props.config || {};

  const sourceFolder = fastHash(Math.random() + '-' + new Date().getTime());
  const rootDir = path.join(env.APP_ROOT, '.tmp', sourceFolder);
  const sourceDir = path.join(rootDir, 'src');
  const rootDist = path.join(rootDir, 'dist');
  if (customConfig.entry) customConfig.entry = path.join(sourceDir, customConfig.entry as string);

  const modulesRoot = path.join(rootDir, 'modules');
  let modules = [];
  if (props.modules) {
    for (const name in props.modules) {
      for (const filename in props.modules[name]) {
        const filePath = path.join(modulesRoot, name, filename);
        ensureDir(path.dirname(filePath));
        writeFileSync(filePath, props.files[filename]);
      }
    }
    modules.push(props.modules);
  }

  const config: IPublicConfig = {
    cache: false,
    devServer: false,
    homeDir: sourceDir,
    logging: { level: 'disabled' },
    modules: modules,
    watcher: false,
    ...customConfig,
  };

  // create the source folders and files
  ensureDir(sourceDir);
  for (const filename in props.files) {
    const filePath = path.join(sourceDir, filename);
    writeFileSync(filePath, props.files[filename]);
  }

  const ctx = createContext({
    envType: props.envType,
    publicConfig: config,
    runProps: { bundles: { app: 'app.js', distRoot: rootDist } },
    scriptRoot: rootDir,
  });

  return {
    ctx,
    sourceDir,
    cleanup: () => {
      fsExtra.removeSync(rootDir);
    },
    runDev: async () => {
      const res = await bundleDev({ ctx });

      return createDevSandbox(ctx, res);
    },
  };
}
