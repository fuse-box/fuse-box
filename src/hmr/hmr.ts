import * as convertSourceMap from 'convert-source-map';
import * as offsetLinesModule from 'offset-sourcemap-lines';
import { createBundle } from '../bundle/bundle';
import { BUNDLE_RUNTIME_NAMES } from '../bundleRuntime/bundleRuntimeCore';
import { Context } from '../core/context';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { IHMRModulesUpdate } from '../types/hmr';
import { Concat, fastHash, fileExists } from '../utils/utils';
function generateUpdateId() {
  return fastHash(new Date().getTime().toString() + Math.random().toString());
}

interface ISummary {
  id: string;
  summary: {
    modules: Array<number>;
  };
}

function generateAppTree(bundleContext: IBundleContext) {
  const tree = {};
  for (const id in bundleContext.modules) {
    const module = bundleContext.modules[id];
    tree[module.id] = {
      deps: module.dependencies,
      path: module.publicPath,
    };
  }
  return tree;
}

const DEFINE_MODULE = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ + '.' + BUNDLE_RUNTIME_NAMES.MODULE_COLLECTION;

function generateUpdateForModules(modules: Array<IModule>): IHMRModulesUpdate {
  const response: IHMRModulesUpdate = [];
  for (const module of modules) {
    const concat = new Concat(true, '', '\n');
    const opening =
      DEFINE_MODULE +
      '[' +
      module.id +
      ']' +
      ` = function(${BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION}, exports, module){`;
    concat.add(null, opening);
    concat.add(null, '// fuse-box-hmr-module-opening');
    concat.add(null, module.contents, module.isSourceMapRequired ? module.sourceMap : undefined);
    concat.add(null, '// fuse-box-hmr-module-closing');
    concat.add(null, '}');

    let stringContent = concat.content.toString();
    const rawSourceMap = concat.sourceMap;
    if (module.isSourceMapRequired) {
      if (rawSourceMap) {
        let json = JSON.parse(rawSourceMap);
        // since new Function wrapoer adds extra 2 lines we need to shift sourcemaps
        json = offsetLinesModule(json, 2);
        const sm = convertSourceMap.fromObject(json).toComment();
        stringContent += '\n' + sm;
      }
    }
    response.push({ content: stringContent, id: module.id, path: module.publicPath });
  }
  return response;
}

export function createHMR(ctx: Context) {
  const { ict } = ctx;
  if (!ctx.config.devServer.enabled) return;
  const devServer = ctx.devServer;
  const tasks: Record<string, any> = {};
  const config = ctx.config;
  ict.on('entry_resolve', async props => {
    const module = props.module;
    if (ctx.config.hmr.enabled) {
      if (config.hmr.plugin) {
        if (!fileExists(config.hmr.plugin)) {
          ctx.fatal('Failed to resolve HMR plugin file', [
            config.hmr.plugin,
            'Make sure to resolve it correctly',
            'File name should absolute or relative to your fuse file',
          ]);
        }
        const data = await module.resolve({ statement: config.hmr.plugin });
        ctx.compilerOptions.buildEnv.hmrModuleId = data.module.id;
      }

      await module.resolve({ statement: 'fuse-box-hot-reload' });
    }
  });

  ict.on('rebundle', props => {
    const id = generateUpdateId();
    tasks[id] = true;
    devServer.clientSend('get-summary', { id });
  });

  ctx.ict.on('watcher_reaction', props => {
    for (const r of props.reactionStack) {
      if (r.absPath === config.hmr.plugin) {
        // send a reload

        ctx.sendPageReload('HMR module plugin');
      }
    }
  });

  function sendUpdates(payload: ISummary, ws_instance: WebSocket) {
    const moduleIds = payload.summary.modules;
    const moduleForUpdate: Array<IModule> = [];

    for (const absPath in ctx.bundleContext.modules) {
      const module = ctx.bundleContext.modules[absPath];
      //console.log(module.absPath, module.isCached);
      if (!moduleIds.includes(module.id) || !module.isCached) {
        moduleForUpdate.push(module);
      }
    }

    const bundle = createBundle({ ctx: ctx });
    bundle.source.modules = moduleForUpdate;

    const appModules = generateAppTree(ctx.bundleContext);

    const updates = generateUpdateForModules(moduleForUpdate);

    const moduleIdsForUpdate = moduleForUpdate.map(m => m.id);

    devServer.clientSend('hmr', { appModules, updates }, ws_instance);
    const amount = moduleIdsForUpdate.length;
    ctx.log.info('hmr', '<dim>Sending $amount $modules to the client</dim>', {
      amount,
      modules: amount !== 1 ? 'modules' : 'module',
    });
  }

  devServer.onClientMessage((event, payload: ISummary, ws_instance?: WebSocket) => {
    const task = tasks[payload.id];
    if (event === 'summary' && payload.id && task) {
      sendUpdates(payload, ws_instance);
    }
  });
}
