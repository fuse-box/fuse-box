import { createConfig } from './config';
import { IConfig } from './interfaces';
import { IAssembleContext, assembleContext } from './assemble_context';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { attachEssentials } from '../integrity/setup';
import { TypescriptConfig } from '../interfaces/TypescriptInterfaces';
import { initTypescriptConfig } from '../tsconfig/configParser';

export class Context {
  public assembleContext: IAssembleContext;
  public interceptor: MainInterceptor;
  public tsConfig: TypescriptConfig;
  constructor(public config: IConfig) {
    this.assembleContext = assembleContext(this);
    this.interceptor = createInterceptor();
    attachEssentials(this);
    this.tsConfig = initTypescriptConfig(config);
  }
}

export function createContext(cfg?: IConfig) {
  return new Context(createConfig(cfg));
}
