import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { fastHash, measureTime } from '../utils/utils';
import { WatcherAction } from '../watcher/watcher';
import { generateHMRContent } from './hmr_content';

function generateUpdateId() {
  return fastHash(new Date().getTime().toString() + Math.random().toString());
}
export interface IHMRExternalProps {}

interface IHMRTask {
  action: WatcherAction;
  packages: Array<Package>;
  modulesForUpdate: Array<Module>;
}

interface IClientSummary {
  id: string;
  summary: { [key: string]: Array<string> };
}
export function attachHMR(ctx: Context) {
  const config = ctx.config;

  if (!config.hmr.enabled) {
    return;
  }

  const devServer = ctx.devServer;
  if (!devServer) {
    return;
  }

  const tasks: { [key: string]: IHMRTask } = {};

  function sortProjectUpdate(task: IHMRTask, payload: IClientSummary) {
    // verity project files first
    const log_pkg = '<bold><yellow>$pkg</yellow></bold>';

    const time = measureTime('hmr');
    const clientProjectFiles = payload.summary['default'];
    const { packages, modulesForUpdate } = task;
    const projectPackage = packages.find(pkg => pkg.isDefaultPackage);
    projectPackage.modules.forEach(module => {
      // if client doesn't the compiled module
      if (!clientProjectFiles.includes(module.props.fuseBoxPath)) {
        ctx.log.print(`<bold><dim>HMR module</dim></bold> $name from ${log_pkg}`, {
          name: module.props.fuseBoxPath,
          pkg: 'default',
        });
        modulesForUpdate.push(module);
      }
    });
    const packagesForUpdate: Array<Package> = [];
    // check vendor consistency
    packages.forEach(pkg => {
      if (pkg.isDefaultPackage) return;

      const name = pkg.getPublicName();
      if (!payload.summary[name]) {
        // here we need the entire package update
        ctx.log.print(`<bold><dim>HMR module</dim></bold> ${log_pkg}`, { pkg: name });
        packagesForUpdate.push(pkg);
        return;
      }
      // check if some files are missing in the package
      const packageFiles = payload.summary[name];
      for (const i in pkg.modules) {
        const module = pkg.modules[i];
        if (!packageFiles.includes(module.props.fuseBoxPath)) {
          // making a partial update
          ctx.log.print(`<bold><dim>HMR module</dim></bold> $name ${log_pkg}`, {
            name: module.props.fuseBoxPath,
            pkg: name,
          });
          modulesForUpdate.push(module);
        }
      }
    });

    const generated = generateHMRContent({ packages: packagesForUpdate, modules: modulesForUpdate, ctx: ctx });
    ctx.log.print('<dim><bold>HMR content generated in $time</dim></bold>', { time: time.end() });
    devServer.clientSend('hmr', { packages: generated.packages, modules: generated.modules });
  }

  // here we recieve an update from client - the entire tree of its modules
  devServer.onClientMessage((event, payload: IClientSummary) => {
    if (event === 'summary' && payload.id && tasks[payload.id]) {
      sortProjectUpdate(tasks[payload.id], payload);
    }
  });

  ctx.ict.on('rebundle_complete', props => {
    const { packages, file } = props;
    if (file) {
      const project = packages.find(pkg => pkg.isDefaultPackage);
      const target = project.modules.find(module => module.props.absPath === file);
      if (target) {
        const task: IHMRTask = {
          packages: packages,
          action: props.watcherAction,
          modulesForUpdate: [target],
        };
        const id = generateUpdateId();
        tasks[id] = task;

        devServer.clientSend('get-summary', { id });
      }
    }
    return props;
  });
}
