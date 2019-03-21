import { attachEssentials } from '../integrity/setup';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { getLogger, ILogger } from '../logging/logging';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { assembleContext, IAssembleContext } from './assemble_context';
import { createConfig } from './config';
import { env } from './env';
import { IConfig } from './interfaces';
import { createWriter, IWriterActions } from './writer';
import { IWebIndexInterface, createWebIndex } from '../web-index/webIndex';

export class Context {
  public assembleContext: IAssembleContext;
  public interceptor: MainInterceptor;
  public tsConfig: TypescriptConfig;
  public log: ILogger;
  public webIndex: IWebIndexInterface;
  public writer: IWriterActions;
  constructor(public config: IConfig) {
    this.tsConfig = initTypescriptConfig(config);
    this.assembleContext = assembleContext(this);
    this.interceptor = createInterceptor();
    this.log = getLogger(config.logging);

    this.writer = createWriter({
      isProduction: !!this.config.production,
      root: env.SCRIPT_PATH,
      output: this.config.output,
    });
    this.webIndex = createWebIndex(this);
    attachEssentials(this);
  }
}

export function createContext(cfg?: IConfig) {
  return new Context(createConfig(cfg));
}
