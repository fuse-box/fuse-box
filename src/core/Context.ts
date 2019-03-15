import { attachEssentials } from '../integrity/setup';
import { createInterceptor, MainInterceptor } from '../interceptor/interceptor';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { initTypescriptConfig } from '../tsconfig/configParser';
import { assembleContext, IAssembleContext } from './assemble_context';
import { createConfig } from './config';
import { IConfig } from './interfaces';

export class Context {
  public assembleContext: IAssembleContext;
  public interceptor: MainInterceptor;
  public tsConfig: TypescriptConfig;
  constructor(public config: IConfig) {
    this.tsConfig = initTypescriptConfig(config);
    this.assembleContext = assembleContext(this);
    this.interceptor = createInterceptor();
    attachEssentials(this);
  }
}

export function createContext(cfg?: IConfig) {
  return new Context(createConfig(cfg));
}
