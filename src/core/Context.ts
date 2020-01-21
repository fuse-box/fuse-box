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
import { TsConfigAtPath } from '../resolver/fileLookup';
import { ensureUserPath, fastHash } from '../utils/utils';
import { createWebIndex, IWebIndexInterface } from '../webIndex/webIndex';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { WeakModuleReferences, createWeakModuleReferences } from './WeakModuleReferences';
import { createWriter, IWriterActions } from './writer';

export class Context {
  public interceptor: MainInterceptor;
  public ict: MainInterceptor;
  public compilerOptions: ICompilerOptions;
  public customTransformers: CustomTransformers;

  public outputConfig?: IOutputConfig;
  public log: FuseBoxLogAdapter;
  public webIndex: IWebIndexInterface;
  public taskManager: ContextTaskManager;
  public writer: IWriterActions;
  public cache: Cache;
  public devServer?: IDevServerActions;
  public weakReferences: WeakModuleReferences;
  public config: PrivateConfig;

  //public productionApiWrapper: ProductionAPIWrapper;
  public tsConfigAtPaths?: Array<TsConfigAtPath>;
  private _uniqueEntryHash: string;

  constructor(config: IPublicConfig, props?: IRunProps) {
    this.config = createConfig(config);
    // @todo: do we want to setup a default?
    this.createOutputConfig((props && props.bundles) || { app: 'app.js' });

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
  }

  public setDevelopment() {
    this.writer = createWriter({
      isProduction: false,
      output: this.config.output,
      root: env.SCRIPT_PATH,
    });

    this.devServer = createDevServer(this);

    this.config.setupEnv();

    this.compilerOptions = createCompilerOptions(this);
  }

  public userTransformers: Array<ITransformer> = [];
  public addTransformer(transformer: ITransformer) {
    this.userTransformers.push(transformer);
  }

  public setProduction(prodProps?: IRunProps) {
    this.config.watch.enabled = false;
    this.config.hmr.enabled = false;

    prodProps = prodProps || {};
    if (prodProps.screwIE === undefined) prodProps.screwIE = true;

    if (prodProps.uglify === undefined) {
      prodProps.uglify = true;
    }
    this.config.production = prodProps;
    this.writer = createWriter({
      isProduction: true,
      output: this.config.output,
      root: env.SCRIPT_PATH,
    });

    this.devServer = createDevServer(this);
    this.config.setupEnv();
    this.compilerOptions = createCompilerOptions(this);

    this.config.manifest = { enabled: false };
    if (prodProps.manifest) {
      if (typeof prodProps.manifest === 'boolean') {
        this.config.manifest.enabled = prodProps.manifest;
      } else {
        this.config.manifest = prodProps.manifest;
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
