import { createConfig } from './config';
import { IConfig } from './interfaces';
import { IAssembleContext, assembleContext } from './assemble_context';
import { MainInterceptor, createInterceptor } from '../interceptor/interceptor';
import { attachEssentials } from '../integrity/setup';
export class Context {
  public assembleContext: IAssembleContext;
  public interceptor: MainInterceptor;
  constructor(public config: IConfig) {
    this.assembleContext = assembleContext(this);
    this.interceptor = createInterceptor();
    attachEssentials(this);
  }
}

export function createContext(cfg?: IConfig) {
  return new Context(createConfig(cfg));
}
