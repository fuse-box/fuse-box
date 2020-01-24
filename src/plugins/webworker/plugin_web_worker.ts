import { IPublicConfig } from '../../config/IConfig';
import { Context } from '../../core/context';
// import { IModule } from '../../moduleResolver/Module';
import { WebWorkerProcess } from './WebWorkerProcess';

// function resolveWorkerPath(module: Module, target: string) {
//   const ctx = module.props.ctx;
//   const config = ctx.config;
//   const resolved = resolveModule({
//     filePath: module.props.absPath,
//     homeDir: config.homeDir,
//     alias: config.alias,
//     javascriptFirst: module.isJavascriptModule(),
//     typescriptPaths: module.pkg.isDefaultPackage && ctx.tsConfig.typescriptPaths,
//     buildTarget: config.target,
//     modules: config.modules,
//     importType: ImportType.REQUIRE,
//     target: target,
//   });
//   return resolved;
// }

export function pluginWebWorker(opts?: { config?: IPublicConfig }) {
  opts = opts || {};

  return (ctx: Context) => {
    const webWorkers: { [key: string]: WebWorkerProcess } = {};

    // function registerWebWorker(workerPath: string, module: IModule) {
    //   if (!webWorkers[workerPath]) {
    //     const workerProcess = new WebWorkerProcess({
    //       ctx,
    //       item: { absPath: workerPath },
    //       module,
    //     });
    //     ctx.log.info('worker', 'registered ' + workerPath);
    //     webWorkers[workerPath] = workerProcess;
    //     return webWorkers[workerPath];
    //   } else {
    //     return webWorkers[workerPath];
    //   }
    // }

    // ctx.transformerAtPath(
    //   ctx.config.homeDir, // limiting workers to home directory
    //   (opts): ITransformer => {
    //     return (visit: IVisit) => {
    //       const { node } = visit;
    //       if (node.type === 'NewExpression' && node.callee && node.callee.type === 'Identifier') {
    //         const callee = node.callee;
    //         if (callee.name === 'Worker' || callee.name === 'SharedWorker') {
    //           const locals = visit.scope && visit.scope.locals ? visit.scope.locals : {};

    //           // if worker has been defined locally
    //           if (locals[callee.name]) return;

    //           const module = opts.module as Module;
    //           if (node.arguments) {
    //             if (node.arguments.length !== 1) {
    //               return ctx.fatal('Worker build error', [
    //                 `at ${module.props.absPath}`,
    //                 'Workers are allowed to have only only one argument',
    //               ]);
    //             }
    //             const firstArgumentNode = node.arguments[0];
    //             if (firstArgumentNode.type !== 'Literal') {
    //               return ctx.fatal('Worker build error', [
    //                 `at ${module.props.absPath}`,
    //                 `An grgument should be a string literal got: ${firstArgumentNode.type}`,
    //               ]);
    //             }

    //             const workerPath = firstArgumentNode.value;
    //             const resolved = resolveWorkerPath(module, workerPath);
    //             if (!resolved || (resolved && !resolved.absPath)) {
    //               return ctx.fatal('Worker build error', [
    //                 `at ${module.props.absPath}`,
    //                 `Unable to resolve worker: ${workerPath}`,
    //                 `Module not found. Make sure ${workerPath} can be resolved and spelled correctly`,
    //               ]);
    //             }
    //             if (resolved.package) {
    //               return ctx.fatal('Worker build error', [
    //                 `at ${module.props.absPath}`,
    //                 `Workers cannot be resolved to a package`,
    //               ]);
    //             }
    //             let workerProcess: WebWorkerProcess = registerWebWorker(resolved.absPath, module);

    //             firstArgumentNode.value = workerProcess.resolveWebWorkerBundlePath();

    //             // store data to cache to retrieve later
    //             const workers = module.getMeta('workers', []) as Array<string>;
    //             if (workers.indexOf(resolved.absPath) === -1) {
    //               workers.push(resolved.absPath);
    //             }
    //           }
    //         }
    //       }
    //     };
    //   },
    // );

    // ctx.ict.on('assemble_module_complete', props => {
    //   const { module } = props;
    //   if (module.isCached && module.isExecutable()) {
    //     const workers = module.getMeta('workers') as Array<string>;
    //     if (workers) {
    //       for (const workerPath of workers) {
    //         registerWebWorker(workerPath, module);
    //       }
    //     }
    //   }
    //   return props;
    // });

    ctx.ict.on('complete', props => {
      for (const webworkerPath in webWorkers) {
        webWorkers[webworkerPath].run(opts.config);
      }

      return props;
    });
  };
}
