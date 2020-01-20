import { IModule } from '../ModuleResolver/Module';
import { Context } from '../core/Context';

export async function processPlugins(props: { ctx: Context; modules: Array<IModule> }) {
  const ctx = props.ctx;
  const ict = ctx.ict;

  for (const module of props.modules) {
    ict.sync('bundle_resolve_module', { module: module });
  }
}
