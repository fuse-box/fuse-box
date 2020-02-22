import { Context } from '../core/Context';
import { Module } from '../core/Module';
import { Package } from '../core/Package';
import { fastHash, measureTime } from '../utils/utils';
import { EXECUTABLE_EXTENSIONS } from '../config/extensions';
import { WatcherAction } from '../watcher/watcher';
import { generateHMRContent } from './hmr_content';

const SCRIPT_EXT_REGEX = new RegExp(`\\.(${EXECUTABLE_EXTENSIONS.join('|').replace(/\./g, '')})$`);

function generateUpdateId() {
  return fastHash(new Date().getTime().toString() + Math.random().toString());
}

interface IHMRTask {
  action: WatcherAction;
  packages: Array<Package>;
  modulesForUpdate: Array<Module>;
}

interface IClientSummary {
  id: string;
  summary: Record<string, string[]>;
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

  const tasks: Record<string, IHMRTask> = {};
  let lastGeneratedHMR = null;
  let lastPayLoadID = null;

  function softProjectUpdate(task: IHMRTask, payload: IClientSummary, ws_instance?: WebSocket) {
    // verify project files first
    const log_pkg = '<bold><yellow>$pkg</yellow></bold>';

    const time = measureTime('hmr');
    // check if its the last payLoadIDm, if so we want to reuse
    if (payload.id === lastPayLoadID) {
      ctx.log.info('hmr', 'Update <dim><$id></dim> has been reused', { id: payload.id });
      devServer.clientSend(
        'hmr',
        { packages: lastGeneratedHMR.packages, modules: lastGeneratedHMR.modules },
        ws_instance,
      );
    } else {
      const clientProjectFiles = payload.summary['default'];
      const { packages, modulesForUpdate } = task;
      const projectPackage = packages.find(pkg => pkg.isDefaultPackage);
      projectPackage.modules.forEach(module => {
        // if client doesn't the compiled module
        if (!clientProjectFiles.includes(module.props.fuseBoxPath)) {
          ctx.log.info('hmr', `Module $name from ${log_pkg}`, {
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
          ctx.log.info('hmr', `Module ${log_pkg}`, { pkg: name });
          packagesForUpdate.push(pkg);
          return;
        }
        // check if some files are missing in the package
        const packageFiles = payload.summary[name];
        for (const i in pkg.modules) {
          const module = pkg.modules[i];
          if (!packageFiles.includes(module.props.fuseBoxPath)) {
            // making a partial update
            ctx.log.info('hmr', `Module $name ${log_pkg}`, {
              name: module.props.fuseBoxPath,
              pkg: name,
            });
            modulesForUpdate.push(module);
          }
        }
      });

      //save lastgenerated, so we can reuse
      lastGeneratedHMR = generateHMRContent({ packages: packagesForUpdate, modules: modulesForUpdate, ctx: ctx });
      lastPayLoadID = payload.id;

      ctx.log.info('hmr', 'Update <dim><$id></dim> generated in $time', {
        time: time.end(),
        id: payload.id,
      });

      devServer.clientSend(
        'hmr',
        { packages: lastGeneratedHMR.packages, modules: lastGeneratedHMR.modules },
        ws_instance,
      );
    }
  }

  // here we recieve an update from client - the entire tree of its modules
  devServer.onClientMessage((event, payload: IClientSummary, ws_instance?: WebSocket) => {
    const task = tasks[payload.id];
    if (event === 'summary' && payload.id && task) {
      softProjectUpdate(task, payload, ws_instance);
    }
  });

  ctx.ict.on('rebundle_complete', props => {
    const { packages, file } = props;

    const hardReloadScripts = ctx.config.hmr.hmrProps.hardReloadScripts;
    if (hardReloadScripts && SCRIPT_EXT_REGEX.test(file)) {
      ctx.log.info('reload', 'Reloading webpage');
      devServer.clientSend('reload', undefined);
    } else if (file) {
      const project = packages.find(pkg => pkg.isDefaultPackage);
      let target = project.modules.find(module => module.props.absPath === file);
      if (!target) {
        // trying weak references
        if (props.ctx.weakReferences.collection[file]) {
          target = project.modules.find(
            module => module.props.absPath === props.ctx.weakReferences.collection[file][0],
          );
          if (target) {
            props.ctx.log.info('hmr', 'Reference mapped: $file', { file: target.props.absPath });
          }
        }
      }
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
