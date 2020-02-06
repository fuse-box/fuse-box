/// <reference path="../../src/types/global.d.ts" />

const { SocketClient } = require('fuse-box-websocket');
function log(text) {
  console.info(`%c${text}`, 'color: #237abe');
}
declare const __fuse: any;

const STYLESHEET_EXTENSIONS = ['.css', '.scss', '.sass', '.less', '.styl'];

function gatherSummary() {
  const modules = [];
  for (const id in __fuse.modules) {
    modules.push(parseInt(id));
  }
  return { modules };
}

export interface IHMRModuleUpdate {
  content: string;
  id: number;
  path: string;
}
export type IHMRModulesUpdate = Array<IHMRModuleUpdate>;

interface IPayload {
  appModules: Record<string, string>;
  updates: Array<IHMRModuleUpdate>;
}

function createHMRHelper(payload: IPayload) {
  const { updates } = payload;
  let isStylesheeetUpdate = true;
  for (const item of updates) {
    const file = item.path;
    const s = file.match(/(\.\w+)$/i);
    const extension = s[1];
    if (!STYLESHEET_EXTENSIONS.includes(extension)) {
      isStylesheeetUpdate = false;
    }
  }
  return {
    isStylesheeetUpdate,
    callEntries: () => {
      const appEntries = __build_env.entries;
      for (const entryId of appEntries) {
        __build_env.require(entryId);
      }
    },
    callModules: (modules: Array<IHMRModuleUpdate>) => {
      for (const item of modules) __build_env.require(item.id);
    },
    flushAll: () => {
      __build_env.cachedModules = {};
    },
    flushModules: (modules: Array<IHMRModuleUpdate>) => {
      for (const item of modules) {
        __build_env.cachedModules[item.id] = undefined;
      }
    },
    updateModules: () => {
      for (const update of updates) {
        new Function(update.content)();
      }
    },
  };
}
export const connect = opts => {
  let client = new SocketClient(opts);
  client.connect();

  client.on('get-summary', data => {
    const { id } = data;
    const summary = gatherSummary();

    client.send('summary', { id, summary });
  });

  client.on('reload', () => {
    window.location.reload();
  });

  client.on('hmr', (payload: IPayload) => {
    const { updates } = payload;
    const hmr = createHMRHelper(payload);
    const hmrModuleId = __build_env.hmrModuleId;
    if (hmrModuleId) {
      // try a plugin
      const hmrModule = __build_env.require(hmrModuleId);
      if (!hmrModule.default) throw new Error('An HMR plugin must export a default function');
      hmrModule.default(payload, hmr);
      return;
    }
    hmr.updateModules();
    if (hmr.isStylesheeetUpdate) {
      log(`Flushing ${updates.map(item => item.path)}`);
      hmr.flushModules(updates);
      log(`Calling modules ${updates.map(item => item.path)}`);
      hmr.callModules(updates);
    } else {
      log(`Flushing all`);
      hmr.flushAll();
      log(`Calling entries all`);
      hmr.callEntries();
    }
  });
};
