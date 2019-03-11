import { Module } from '../core/Module';

export interface InterceptorEvents {
  test?: { foo: string };
  assemble_module?: { module: Module };
}
