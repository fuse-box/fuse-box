import { createDevServer, IDevServerActions } from '../dev-server/devServer';
import { attachEssentials } from '../integrity/setup';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { getLogger, ILogger } from '../logging/logging';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { createWebIndex, IWebIndexInterface } from '../web-index/webIndex';
import { assembleContext, IAssembleContext } from './assemble_context';
import { createConfig } from './config';
import { env } from './env';
import { IConfig } from './interfaces';
import { createWriter, IWriterActions } from './writer';
import { createCache } from '../cache/cache';
import { Cache } from '../cache/cache';
import { Package } from './Package';

export class Context {
  public assembleContext: IAssembleContext;
  public packages: Array<Package>;
  public interceptor: MainInterceptor;
  public ict: MainInterceptor;
  public tsConfig: TypescriptConfig;
  public log: ILogger;
  public webIndex: IWebIndexInterface;
  public writer: IWriterActions;
  public cache: Cache;
  public devServer?: IDevServerActions;
  constructor(public config: IConfig) {
    this.tsConfig = initTypescriptConfig(config);
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
  }
}

export function createContext(cfg?: IConfig) {
  return new Context(createConfig(cfg));
}
