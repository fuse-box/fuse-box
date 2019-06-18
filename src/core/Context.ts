import { Cache, createCache } from '../cache/cache';
import { createConfig } from '../config/config';
import { IPublicConfig } from '../config/IPublicConfig';
import { PrivateConfig } from '../config/PrivateConfig';
import { createDevServer, IDevServerActions } from '../dev-server/devServer';
import { env } from '../env';
import { attachEssentials } from '../integrity/setup';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { getLogger, ILogger } from '../logging/logging';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { createWebIndex, IWebIndexInterface } from '../web-index/webIndex';
import { assembleContext, IAssembleContext } from './assemble_context';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { Package } from './Package';
import { createWeakModuleReferences, WeakModuleReferences } from './WeakModuleReferences';
import { createWriter, IWriterActions } from './writer';
import { IProductionProps } from '../config/IProductionProps';
import { ProductionAPIWrapper } from '../production/api/ProductionApiWrapper';

export class Context {
  public assembleContext: IAssembleContext;
  public packages: Array<Package>;
  public interceptor: MainInterceptor;
  public ict: MainInterceptor;
  public tsConfig: TypescriptConfig;
  public log: ILogger;
  public webIndex: IWebIndexInterface;
  public taskManager: ContextTaskManager;
  public writer: IWriterActions;
  public cache: Cache;
  public devServer?: IDevServerActions;
  public weakReferences: WeakModuleReferences;

  public productionApiWrapper: ProductionAPIWrapper;

  constructor(public config: PrivateConfig) {
    this.config.ctx = this;
    this.weakReferences = createWeakModuleReferences(this);
    this.assembleContext = assembleContext(this);
    this.ict = createInterceptor();

    this.log = getLogger(config.logging);

    this.writer = createWriter({
      isProduction: !!this.config.production,
      root: env.SCRIPT_PATH,
      output: this.config.output,
    });
    this.webIndex = createWebIndex(this);
    attachEssentials(this);

    this.taskManager = createContextTaskManager(this);
  }

  public setDevelopment() {
    this.tsConfig = initTypescriptConfig(this.config);
    this.devServer = createDevServer(this);
    if (this.config.cache) {
      this.cache = createCache({ ctx: this });
    }
    this.config.setupEnv();
  }

  public setProduction(prodProps: IProductionProps) {
    prodProps = prodProps || {};
    if (prodProps.screwIE === undefined) prodProps.screwIE = true;

    if (prodProps.uglify === undefined) {
      prodProps.uglify = true;
    }

    this.config.production = prodProps;
    this.tsConfig = initTypescriptConfig(this.config);

    this.devServer = createDevServer(this);
    this.config.setupEnv();
    this.productionApiWrapper = new ProductionAPIWrapper(this);
  }

  public requireModule(name: string) {
    try {
      return require(name);
    } catch (error) {
      this.log.error('Cannot import $name. Forgot to insall? ', { name: name });
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
