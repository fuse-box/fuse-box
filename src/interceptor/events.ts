import { Module } from '../core/Module';

export interface InterceptorEvents {
  test?: { foo: string };
  assemble_module?: { module: Module };
  assemble_fast_analysis?: { module: Module };
  assemble_ts_module?: { module: Module };
  assemble_pr_module?: { module: Module };
  assemble_nm_module?: { module: Module };
}
