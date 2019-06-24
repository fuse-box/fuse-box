import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { ImportType, resolveModule } from '../resolver/resolver';
import { registerWebWorkerProcess, WebWorkerProcess } from './WebWorkerProcess';

function resolveWorkerPath(module: Module, target: string) {
  const ctx = module.props.ctx;
  const config = ctx.config;
  const resolved = resolveModule({
    filePath: module.props.absPath,
    homeDir: config.homeDir,
    alias: config.alias,
    javascriptFirst: module.isJavascriptModule(),
    typescriptPaths: module.pkg.isDefaultPackage && ctx.tsConfig.typescriptPaths,
    buildTarget: config.target,
    modules: config.modules,
    importType: ImportType.REQUIRE,
    target: target,
  });
  if (resolved.package) {
    ctx.log.error(
      'WebWorker: It looks like $target in $module points to an external package. Automatic workers can only work inside your project',
      { target, module },
    );
    return;
  }
  if (!resolved.absPath) {
    ctx.log.error('WebWorker: Failed to resolve $target in $module', { target, module });
    return;
  }
  return resolved;
}

async function launchWebWorkerProcesses(ctx: Context, items: Array<WebWorkerProcess>) {
  for (const ww of items) {
    await ww.startDev();
  }
}
export function devWorkers(ctx: Context) {
  ctx.ict.on('assemble_fast_analysis', props => {
    const { module } = props;
    if (module.fastAnalysis.workers) {
      module.fastAnalysis.workers.forEach(workerPath => {
        const resolved = resolveWorkerPath(props.module, workerPath);
        if (resolved) {
          registerWebWorkerProcess({ resolved, ctx: module.props.ctx });
        }
      });
    }
    return props;
  });

  ctx.ict.on('complete', props => {
    if (ctx.webWorkers) {
      launchWebWorkerProcesses(ctx, ctx.webWorkers);
    }
    return props;
  });
}
