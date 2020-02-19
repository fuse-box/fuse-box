import * as path from 'path';
import { CustomTransformers } from 'typescript';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { ImportType } from '../compiler/interfaces/ImportType';
import { createCompilerOptions } from '../compilerOptions/compilerOptions';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { EnvironmentType } from '../config/EnvironmentType';
import { IConfig, IPublicConfig } from '../config/IConfig';
import { IRunProps } from '../config/IRunProps';
import { createConfig } from '../config/config';
import { createDevServer, IDevServerActions } from '../devServer/devServer';
import { env } from '../env';
import { FuseBoxLogAdapter, createFuseLogger } from '../fuseLog/FuseBoxLogAdapter';
import { createHMR } from '../hmr/hmr';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { resolve } from '../moduleResolver/moduleResolver';
import { outputConfigConverter } from '../output/OutputConfigConverter';
import { IOutputConfig } from '../output/OutputConfigInterface';
import { DistWriter, distWriter } from '../output/distWriter';
import { TsConfigAtPath } from '../resolver/fileLookup';
import { getFileModificationTime } from '../utils/utils';
import { createWatcher } from '../watcher/watcher';
import { createWebIndex, IWebIndexInterface } from '../webIndex/webIndex';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { WeakModuleReferences } from './WeakModuleReferences';

export interface ILinkedReference {
  deps: Array<number>;
  mtime: number;
}
export type LinkedReferences = Record<string, ILinkedReference>;

export interface Context {
  bundleContext?: IBundleContext;
  cache?: Cache;
  compilerOptions?: ICompilerOptions;
  config?: IConfig;
  customTransformers?: CustomTransformers;
  devServer?: IDevServerActions;
  ict?: MainInterceptor;
  interceptor?: MainInterceptor;
  isWorking?: boolean;
  /**
   * A list of of references that do not come naturally in form of javascript imports
   * for example css imports
   * This will be used by the watcher to determine if a file should be reloaded
   */
  linkedReferences?: LinkedReferences;
  log?: FuseBoxLogAdapter;
  outputConfig?: IOutputConfig;
  // a list of of system dependencies with names and ids
  // storable to cache
  systemDependencies?: Record<string, number>;
  taskManager?: ContextTaskManager;
  tsConfigAtPaths?: Array<TsConfigAtPath>;
  userTransformers?: Array<ITransformer>;
  weakReferences?: WeakModuleReferences;
  webIndex?: IWebIndexInterface;
  writer?: DistWriter;
  fatal?: (header: string, messages?: Array<string>) => void;
  getCachable?: () => any;
  registerTransformer?: (transformer: ITransformer) => void;
  sendPageReload?: (reason?: string) => void;
  setLinkedReference?: (asbPath: string, module: IModule) => void;
  setPersistantModuleDependency?: (module: IModule, dependencyName: string) => void;
}

export interface ICreateContextProps {
  envType: EnvironmentType;
  publicConfig: IPublicConfig;
  runProps?: IRunProps;
  scriptRoot?: string;
}

export function createContext(props: ICreateContextProps): Context {
  const self: Context = {
    linkedReferences: {},
    systemDependencies: {},
    fatal: (header: string, messages?: Array<string>) => {
      self.log.fuseFatal(header, messages);
      process.exit(1);
    },
    getCachable: () => {
      return {
        linkedReferences: self.linkedReferences,
        systemDependencies: self.systemDependencies,
        tsConfigAtPaths: self.tsConfigAtPaths,
      };
    },
    sendPageReload: (reason?: string) => {
      if (self.devServer) {
        //self.log.line();

        setTimeout(() => {
          self.log.info('hmr', 'Reloading your browser.' + (reason ? ` Reason: ${reason}` : ''));
        }, 10);
        self.devServer.clientSend('reload', {});
      }
    },
    setLinkedReference: (absPath: string, module: IModule) => {
      let ref = self.linkedReferences[absPath];

      if (!ref) {
        ref = self.linkedReferences[absPath] = { deps: [], mtime: getFileModificationTime(absPath) };
      }
      if (!ref.deps.includes(module.id)) ref.deps.push(module.id);
    },
    setPersistantModuleDependency: (module: IModule, dependencyName: string) => {
      const { module: dependencyObject } = resolve({
        bundleContext: self.bundleContext,
        ctx: self,
        importType: ImportType.REQUIRE,
        parent: module,
        statement: dependencyName,
      });
      self.systemDependencies[dependencyName] = dependencyObject.id;
    },
  };

  const runProps: IRunProps = props.runProps || {};

  let publicConfig = props.publicConfig;

  let publicPath: string;
  if (typeof publicConfig.webIndex === 'object' && publicConfig.webIndex.publicPath)
    publicPath = publicConfig.webIndex.publicPath;

  self.outputConfig = outputConfigConverter({
    defaultPublicPath: publicPath,
    defaultRoot: path.join(props.scriptRoot || env.SCRIPT_PATH, 'dist'),
    publicConfig: runProps.bundles,
  });
  self.writer = distWriter({
    hashEnabled: props.envType === EnvironmentType.PRODUCTION,
    root: self.outputConfig.distRoot,
  });
  // configuration must be iniialised after the dist writer
  self.config = createConfig({
    ctx: self,
    envType: props.envType,
    publicConfig: publicConfig,
    runProps: props.runProps,
  });

  self.log = createFuseLogger(self.config.logging);
  //self.weakReferences = createWeakModuleReferences(self);
  self.ict = createInterceptor();

  self.webIndex = createWebIndex(self);
  self.taskManager = createContextTaskManager(self);

  self.compilerOptions = createCompilerOptions(self);

  // custom transformers
  self.userTransformers = [];
  self.registerTransformer = (transformer: ITransformer) => self.userTransformers.push(transformer);

  if (!env.isTest) {
    self.devServer = createDevServer(self);
  }

  createWatcher(self);
  // custom ts configs at path
  self.tsConfigAtPaths = [];

  if (self.config.hmr.enabled) createHMR(self);

  return self;
}
