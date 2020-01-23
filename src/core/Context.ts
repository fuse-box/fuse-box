import { CustomTransformers } from 'typescript';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { createCompilerOptions } from '../compilerOptions/compilerOptions';
import { ICompilerOptions } from '../compilerOptions/interfaces';
import { IPublicConfig } from '../config/IPublicConfig';
import { IRunProps } from '../config/IRunProps';
import { PrivateConfig } from '../config/PrivateConfig';
import { createConfig } from '../config/config';
import { createDevServer, IDevServerActions } from '../devServer/devServer';
import { env } from '../env';
import { FuseBoxLogAdapter, createFuseLogger } from '../fuseLog/FuseBoxLogAdapter';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { outputConfigConverter } from '../output/OutputConfigConverter';
import { IOutputConfig, IPublicOutputConfig } from '../output/OutputConfigInterface';
import { distWriter, IDistWriter } from '../output/distWriter';
import { TsConfigAtPath } from '../resolver/fileLookup';
import { ensureUserPath } from '../utils/utils';
import { createWebIndex, IWebIndexInterface } from '../webIndex/webIndex';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { WeakModuleReferences, createWeakModuleReferences } from './WeakModuleReferences';

export class Context {
  public interceptor: MainInterceptor;
  public ict: MainInterceptor;
  public compilerOptions: ICompilerOptions;
  public customTransformers: CustomTransformers;

  public outputConfig?: IOutputConfig;
  public log: FuseBoxLogAdapter;
  public webIndex: IWebIndexInterface;
  public taskManager: ContextTaskManager;

  public cache: Cache;
  public devServer?: IDevServerActions;
  public weakReferences: WeakModuleReferences;
  public config: PrivateConfig;
  public writer: IDistWriter;
  //public productionApiWrapper: ProductionAPIWrapper;
  public tsConfigAtPaths?: Array<TsConfigAtPath>;

  constructor(config: IPublicConfig, props?: IRunProps) {
    this.config = createConfig(config);
    // @todo: do we want to setup a default?

    this.config.ctx = this;
    this.log = createFuseLogger(this.config.logging);
    this.weakReferences = createWeakModuleReferences(this);

    this.ict = createInterceptor();

    this.webIndex = createWebIndex(this);

    this.taskManager = createContextTaskManager(this);
  }

  public addTsConfigAtPath(path: TsConfigAtPath) {
    if (!this.tsConfigAtPaths) this.tsConfigAtPaths = [];
    this.tsConfigAtPaths.push(path);
  }

  public createOutputConfig(publicConfig: IPublicOutputConfig) {
    this.outputConfig = outputConfigConverter({ defaultRoot: env.SCRIPT_PATH, publicConfig: publicConfig });

    this.writer = distWriter({ hashEnabled: !!this.config.production, root: this.outputConfig.root });
  }

  public setDevelopment(runProps?: IRunProps) {
    this.createOutputConfig((runProps && runProps.bundles) || { app: 'app.js' });
    this.devServer = createDevServer(this);

    this.config.setupEnv();

    this.compilerOptions = createCompilerOptions(this);
  }

  public userTransformers: Array<ITransformer> = [];
  public addTransformer(transformer: ITransformer) {
    this.userTransformers.push(transformer);
  }

  public setProduction(runProps?: IRunProps) {
    this.config.watch.enabled = false;
    this.config.hmr.enabled = false;

    runProps = runProps || {};
    if (runProps.screwIE === undefined) runProps.screwIE = true;

    if (runProps.uglify === undefined) {
      runProps.uglify = true;
    }
    this.config.production = runProps;
    this.createOutputConfig((runProps && runProps.bundles) || { app: 'app.js' });
    this.devServer = createDevServer(this);
    this.config.setupEnv();
    this.compilerOptions = createCompilerOptions(this);

    this.config.manifest = { enabled: false };
    if (runProps.manifest) {
      if (typeof runProps.manifest === 'boolean') {
        this.config.manifest.enabled = runProps.manifest;
      } else {
        this.config.manifest = runProps.manifest;
        if (this.config.manifest.enabled === undefined) {
          this.config.manifest.enabled = true;
        }
      }
    }
    if (!this.config.manifest.filePath) {
      this.config.manifest.filePath = 'manifest.json';
    }
    this.config.manifest.filePath = ensureUserPath(this.config.manifest.filePath, this.writer.outputDirectory);
  }

  public fatal(header: string, messages?: Array<string>) {
    this.log.clearConsole();
    this.log.fuseFatal(header, messages);
    process.exit(1);
  }

  public isInstalled(name) {
    try {
      return require(name);
    } catch (e) {
      return false;
    }
  }
}

export function createContext(config: IPublicConfig, props?: IRunProps): Context {
  return new Context(config, props);
}

// temporary fix
export function createEnvContext(props: {
  config: IPublicConfig;
  runProps?: IRunProps;
  type: 'development' | 'production';
}): Context {
  const ctx = new Context(props.config, props.runProps);
  if (props.type === 'development') ctx.setDevelopment(props.runProps);
  if (props.type === 'production') ctx.setProduction(props.runProps);
  return ctx;
}
