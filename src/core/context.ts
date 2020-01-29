import * as path from 'path';
import { CustomTransformers } from 'typescript';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { createCompilerOptions } from '../compilerOptions/compilerOptions';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { EnvironmentType } from '../config/EnvironmentType';
import { IConfig, IPublicConfig } from '../config/IConfig';
import { IRunProps } from '../config/IRunProps';
import { createConfig } from '../config/config';
import { createDevServer, IDevServerActions } from '../devServer/devServer';
import { env } from '../env';
import { FuseBoxLogAdapter, createFuseLogger } from '../fuseLog/FuseBoxLogAdapter';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { outputConfigConverter } from '../output/OutputConfigConverter';
import { IOutputConfig } from '../output/OutputConfigInterface';
import { DistWriter, distWriter } from '../output/distWriter';
import { TsConfigAtPath } from '../resolver/fileLookup';
import { createWatcher } from '../watcher/watcher';
import { createWebIndex, IWebIndexInterface } from '../webIndex/webIndex';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { WeakModuleReferences } from './WeakModuleReferences';

export interface Context {
  cache?: Cache;
  compilerOptions?: ICompilerOptions;
  config?: IConfig;
  customTransformers?: CustomTransformers;
  devServer?: IDevServerActions;
  ict?: MainInterceptor;
  interceptor?: MainInterceptor;
  isWorking?: boolean;
  log?: FuseBoxLogAdapter;
  outputConfig?: IOutputConfig;
  taskManager?: ContextTaskManager;
  tsConfigAtPaths?: Array<TsConfigAtPath>;
  userTransformers?: Array<ITransformer>;
  weakReferences?: WeakModuleReferences;
  webIndex?: IWebIndexInterface;
  writer?: DistWriter;
  fatal?: (header: string, messages?: Array<string>) => void;
  registerTransformer?: (transformer: ITransformer) => void;
}

export interface ICreateContextProps {
  envType: EnvironmentType;
  publicConfig: IPublicConfig;
  runProps?: IRunProps;
  scriptRoot?: string;
}

export function createContext(props: ICreateContextProps): Context {
  const self: Context = {
    fatal: (header: string, messages?: Array<string>) => {
      self.log.clearConsole();
      self.log.fuseFatal(header, messages);
      process.exit(1);
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
  return self;
}
