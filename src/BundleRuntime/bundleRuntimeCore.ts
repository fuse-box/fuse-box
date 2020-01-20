import { ITarget } from '../config/PrivateConfig';

export const BUNDLE_RUNTIME_NAMES = {
  GLOBAL_OBJ: '__fuse',
  REQUIRE_FUNCTION: 'r',
  BUNDLE_FUNCTION: 'bundle',
  ARG_REQUIRE_FUNCTION: '__fusereq',
};

export interface IBundleRuntimeCore {
  target: ITarget;
  isIsolated?: boolean;
}
export function bundleRuntimeCore(props: IBundleRuntimeCore) {
  const { target } = props;
  const isIsolated = props.target === 'web-worker' || props.isIsolated;
  let coreVariable;
  // web-worker cannot share anything with bundle, hence it gets an isolated mode
  if (isIsolated) {
    coreVariable = `var core = {}`;
  } else if (target === 'browser' || target === 'electron') {
    // storing directly to browser window object
    coreVariable = `var core = window.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = window.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} || {};`;
  } else if (target === 'server') {
    // storing to global object
    coreVariable = `var core = global.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = global.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} || {};`;
  }

  const CODE = `${isIsolated ? `var ${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = ` : ''}(function() {
  ${coreVariable}
  var modules = core.modules = core.modules || {};
  core.${BUNDLE_RUNTIME_NAMES.BUNDLE_FUNCTION} = function(collection, fn) {
    for (var num in collection) {
      modules[num] = collection[num];
    }
    fn ? fn() : void 0;
  };
  core.c = {};
  core.${BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION} = function(id) {
    var cached = core.c[id];
    if (cached) return cached.m.exports;
    var module = modules[id];
    if (!module) {
      // code splitting here
      return;
    }
    cached = core.c[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(core.${BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION}, cached.exports, cached.m);
    return cached.m.exports;
  }; ${isIsolated ? '\n\treturn core;' : ''}
})();`;
  return CODE;
}
