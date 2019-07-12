import { IWebWorkerItem } from '../analysis/fastAnalysis';
import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { ImportType, resolveModule } from '../resolver/resolver';
import { registerWebWorkerProcess } from './WebWorkerProcess';

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

export function attachWebWorkers(ctx: Context) {
  if (!ctx.config.webWorkers.enabled) {
    return;
  }

  function ensureWorkerExists(wk: IWebWorkerItem, module: Module) {
    if (!ctx.webWorkers[wk.absPath]) {
      return registerWebWorkerProcess({ item: wk, module, ctx: ctx });
    } else {
      return ctx.webWorkers[wk.absPath];
    }
  }

  ctx.ict.on('assemble_module_init', props => {
    const { module } = props;
    if (module.isCached && props.module.fastAnalysis && props.module.fastAnalysis.workers) {
      module.fastAnalysis.workers.forEach(wk => {
        if (wk.absPath) {
          const webWorkerProcess = ensureWorkerExists(wk, module);
          webWorkerProcess.resolveWebWorkerBundlePath();
        }
      });
    }
    return props;
  });

  ctx.ict.on('assemble_fast_analysis', props => {
    const { module } = props;
    if (props.module.fastAnalysis && props.module.fastAnalysis.workers) {
      module.fastAnalysis.workers.forEach(wk => {
        const resolved = resolveWorkerPath(module, wk.path);
        // this will be saved to cache
        wk.absPath = resolved.absPath;
        const webWorkerProcess = ensureWorkerExists(wk, module);
        wk.bundlePath = webWorkerProcess.resolveWebWorkerBundlePath();
      });
    }
    return props;
  });

  ctx.ict.on('complete', props => {
    if (ctx.webWorkers) {
      for (const absPath in ctx.webWorkers) {
        ctx.webWorkers[absPath].run();
      }
    }
    return props;
  });
}
