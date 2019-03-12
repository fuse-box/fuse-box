import { Context } from '../core/context';
import { Module } from '../core/Module';

export function registerTypescriptIntegrityInterceptors(ctx: Context) {
  ctx.interceptor.on('assemble_ts_module', (props: { module: Module }) => {
    assembleTypescript(props.module);
    return props;
  });
}

export function assembleTypescript(module: Module) {
  const ctx = module.props.ctx;
  const analysis = module.fastAnalysis;
  analysis.report.browserEssentials;
}
