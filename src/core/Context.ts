import { Cache, createCache } from '../cache/cache';
import { createConfig } from '../config/config';
import { PrivateConfig } from '../config/PrivateConfig';
import { IPublicConfig } from '../config/IPublicConfig';
import { createDevServer, IDevServerActions } from '../dev-server/devServer';
import { attachEssentials } from '../integrity/setup';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { getLogger, ILogger } from '../logging/logging';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { createWebIndex, IWebIndexInterface } from '../web-index/webIndex';
import { assembleContext, IAssembleContext } from './assemble_context';
import { ContextTaskManager, createContextTaskManager } from './ContextTaskManager';
import { env } from '../env';
import { Package } from './Package';
import { createWriter, IWriterActions } from './writer';
import { WeakModuleReferences, createWeakModuleReferences } from './WeakModuleReferences';

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

  constructor(public config: PrivateConfig) {
    this.tsConfig = initTypescriptConfig(config);
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
    this.devServer = createDevServer(this);
    if (this.config.cache) {
      this.cache = createCache({ ctx: this });
    }
    this.taskManager = createContextTaskManager(this);
  }

  public requireModule(name: string) {
    try {
      return require(name);
    } catch (error) {
      console.log(error);
      this.log.error('Cannot import $name. Forgot to insall? ', { name: name });
    }
  }
}

export function createContext(cfg?: IPublicConfig) {
  return new Context(createConfig(cfg));
}
