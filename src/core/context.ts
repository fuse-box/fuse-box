import * as path from 'path';
import { CustomTransformers } from 'typescript';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { createCompilerOptions } from '../compilerOptions/compilerOptions';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { createTsTargetResolver } from '../compilerOptions/typescriptReferences';
import { EnvironmentType } from '../config/EnvironmentType';
import { IConfig, IPublicConfig } from '../config/IConfig';
import { IRunProps } from '../config/IRunProps';
import { createConfig } from '../config/config';
import { createDevServer, IDevServerActions } from '../devServer/devServer';
import { IServerProcess } from '../devServer/server';
import { env } from '../env';
import { FuseBoxLogAdapter, createFuseLogger } from '../fuseLog/FuseBoxLogAdapter';
import { createHMR } from '../hmr/hmr';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { outputConfigConverter } from '../output/OutputConfigConverter';
import { IOutputConfig } from '../output/OutputConfigInterface';
import { DistWriter, distWriter } from '../output/distWriter';
import { TargetResolver, TsConfigAtPath } from '../resolver/fileLookup';
import { CompilerHub, createCompilerHub } from '../threading/worker_threads/compilerHub';
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
  compilerHub?: CompilerHub;
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
  meta?: Record<string, any>;
  outputConfig?: IOutputConfig;
  serverProcess?: IServerProcess;
  // a list of of system dependencies with names and ids
  // storable to cache
  systemDependencies?: Record<string, number>;
  taskManager?: ContextTaskManager;
  tsConfigAtPaths?: Array<TsConfigAtPath>;
  /**
   * This is a resolver that can take an import of an output file (such as dist/foo.js)
   * and resolve it to its corresponding source file (e.g. src/foo.ts)
   * These are built from recursing the "references" fields in tsconfig.json files
   * see https://www.typescriptlang.org/docs/handbook/project-references.html
   */
  tsTargetResolver?: TargetResolver;
  userTransformers?: Array<ITransformer>;
  weakReferences?: WeakModuleReferences;
  webIndex?: IWebIndexInterface;
  writer?: DistWriter;
  fatal?: (header: string, messages?: Array<string>) => void;
  getCachable?: () => any;
  sendPageReload?: (reason?: string) => void;
  setLinkedReference?: (asbPath: string, module: IModule) => void;
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
  };

  self.meta = {};
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

  // Resolver that can calculate typescript output->input mappings from references
  self.tsTargetResolver =
    self.compilerOptions.tsReferences &&
    createTsTargetResolver(
      self.compilerOptions.tsReferences,
      self.compilerOptions.tsConfig || path.dirname(path.join(env.SCRIPT_FILE)),
    );

  // custom transformers
  self.userTransformers = [];

  if (!env.isTest) {
    self.devServer = createDevServer(self);
  }

  createWatcher(self);
  // custom ts configs at path
  self.tsConfigAtPaths = [];

  if (self.config.hmr.enabled) createHMR(self);

  self.compilerHub = createCompilerHub(self);
  return self;
}
