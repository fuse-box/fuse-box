import { Module } from '../core/Module';
import { Context } from '../core/Context';
import { Package } from '../core/Package';
import { Bundle, IBundleWriteResponse } from '../bundle/Bundle';

export interface InterceptorEvents {
  test?: { foo: string };
  assemble_module?: { module: Module };
  assemble_fast_analysis?: { module: Module };
  assemble_ts_module?: { module: Module };
  assemble_pr_module?: { module: Module };
  assemble_nm_module?: { module: Module };
  bundle_resolve_start: { ctx: Context; packages: Array<Package> };
  bundle_resolve_end: { ctx: Context; packages: Array<Package> };
  bundle_resolve_typescript_module: { module: Module };
  bundle_resolve_js_module: { module: Module };
  bundle_resolve_module: { module: Module };
  before_bundle_write: { bundle: Bundle };
  after_bundle_write: { bundle: Bundle };
  complete: { ctx: Context; bundles: Array<IBundleWriteResponse> };
}
