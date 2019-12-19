import { CustomTransformers } from 'typescript';
import { Cache, createCache } from '../cache/cache';
import { ITransformer } from '../compiler/interfaces/ITransformer';
import { createConfig } from '../config/config';
import { IProductionProps } from '../config/IProductionProps';
import { IPublicConfig } from '../config/IPublicConfig';
import { PrivateConfig } from '../config/PrivateConfig';
import { createDevServer, IDevServerActions } from '../dev-server/devServer';
import { env } from '../env';
import { createFuseLogger, FuseBoxLogAdapter } from '../fuse-log/FuseBoxLogAdapter';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { TsConfigAtPath } from '../resolver/fileLookup';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { ensureUserPath, fastHash } from '../utils/utils';
import { createWebIndex, IWebIndexInterface } from '../web-index/webIndex';
import { assembleContext, IAssembleContext } from './assemble_context';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { Package } from './Package';
import { createWeakModuleReferences, WeakModuleReferences } from './WeakModuleReferences';
import { createWriter, IWriterActions } from './writer';

export class Context {
  public assembleContext: IAssembleContext;
  public packages: Array<Package>;
  public interceptor: MainInterceptor;
  public ict: MainInterceptor;
  public tsConfig: TypescriptConfig;
  public customTransformers: CustomTransformers;
  public log: FuseBoxLogAdapter;
  public webIndex: IWebIndexInterface;
  public taskManager: ContextTaskManager;
  public writer: IWriterActions;
  public cache: Cache;
  public devServer?: IDevServerActions;
  public weakReferences: WeakModuleReferences;

  //public productionApiWrapper: ProductionAPIWrapper;
  public tsConfigAtPaths?: Array<TsConfigAtPath>;
  private _uniqueEntryHash: string;

  constructor(public config: PrivateConfig) {
    this.config.ctx = this;
    this.log = createFuseLogger(this.config.logging);
    this.weakReferences = createWeakModuleReferences(this);
    this.assembleContext = assembleContext(this);
    this.ict = createInterceptor();

    this.webIndex = createWebIndex(this);

    this.taskManager = createContextTaskManager(this);
  }

  public addTsConfigAtPath(path: TsConfigAtPath) {
    if (!this.tsConfigAtPaths) this.tsConfigAtPaths = [];
    this.tsConfigAtPaths.push(path);
  }

  public getUniqueEntryHash() {
    if (this._uniqueEntryHash) return this._uniqueEntryHash;
    if (!this.config.entries) return '';

    this._uniqueEntryHash = fastHash(this.config.entries.join('')) + '_';
    return this._uniqueEntryHash;
  }

  public setDevelopment() {
    this.writer = createWriter({
      isProduction: false,
      root: env.SCRIPT_PATH,
      output: this.config.output,
    });
    try {
      this.tsConfig = initTypescriptConfig(this.config);
    } catch (e) {
      this.fatal('Cannot initialise tsconfig', [e.message]);
    }
    this.devServer = createDevServer(this);

    if (this.config.cache && this.config.cache.enabled) {
      if (this.config.cacheObject) this.cache = this.config.cacheObject;
      else this.cache = createCache({ ctx: this });
    }

    this.config.setupEnv();
  }

  public userTransformers: Array<ITransformer> = [];
  public addTransformer(transformer: ITransformer) {
    this.userTransformers.push(transformer);
  }

  public setProduction(prodProps: IProductionProps) {
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
      root: env.SCRIPT_PATH,
      output: this.config.output,
    });
    try {
      this.tsConfig = initTypescriptConfig(this.config);
    } catch (e) {
      this.fatal('Cannot initialise tsconfig', [e.message]);
    }

    this.devServer = createDevServer(this);
    this.config.setupEnv();
    //    this.productionApiWrapper = new ProductionAPIWrapper(this);

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

  public get useSingleBundle() {
    return this.config.useSingleBundle || this.config.target === 'web-worker';
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

export function createContext(cfg?: IPublicConfig) {
  const context = new Context(createConfig(cfg));
  context.setDevelopment();
  return context;
}

export function createProdContext(cfg: IPublicConfig, prodProps: IProductionProps) {
  const context = new Context(createConfig(cfg));
  context.setProduction(prodProps);
  return context;
}
