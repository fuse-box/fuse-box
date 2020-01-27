import { ITarget } from '../config/ITarget';

export const BUNDLE_RUNTIME_NAMES = {
  ARG_REQUIRE_FUNCTION: '__fusereq',
  BUNDLE_FUNCTION: 'bundle',
  GLOBAL_OBJ: '__fuse',
  INTEROP_REQUIRE_DEFAULT_FUNCTION: 'dt',
  REQUIRE_FUNCTION: 'r',
};

export type ICodeSplittingMap = {
  e: Record<number, { b: string }>;
};

export interface IBundleRuntimeCore {
  codeSplittingMap?: ICodeSplittingMap;
  interopRequireDefault?: boolean;
  isIsolated?: boolean;
  target: ITarget;
}

const INTEROP_DEFAULT = BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION;

export function bundleRuntimeCore(props: IBundleRuntimeCore) {
  const { target } = props;
  const isIsolated = props.target === 'web-worker' || props.isIsolated;
  let coreVariable;
  // web-worker cannot share anything with bundle, hence it gets an isolated mode
  if (isIsolated) {
    coreVariable = `var f = {};`;
  } else if (target === 'browser' || target === 'electron') {
    // storing directly to browser window object
    coreVariable = `var f = window.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = window.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} || {};`;
  } else if (target === 'server') {
    // storing to global object
    coreVariable = `var f = global.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = global.${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} || {};`;
  }

  let optional = '';
  if (props.interopRequireDefault) {
    optional += `f.${INTEROP_DEFAULT} = function (x) { return x !== undefined && x.default !== undefined ? x.default : x; };`;
  }

  const CODE = `${isIsolated ? `var ${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = ` : ''}(function() {
  ${coreVariable}
  var modules = f.modules = f.modules || {}; ${optional}
  f.${BUNDLE_RUNTIME_NAMES.BUNDLE_FUNCTION} = function(collection, fn) {
    for (var num in collection) {
      modules[num] = collection[num];
    }
    fn ? fn() : void 0;
  };
  f.c = {};
  f.${BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION} = function(id) {
    var cached = f.c[id];
    if (cached) return cached.m.exports;
    var module = modules[id];
    if (!module) {
      return;
    }
    cached = f.c[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(f.${BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION}, cached.exports, cached.m);
    return cached.m.exports;
  }; ${isIsolated ? '\n\treturn f;' : ''}
})();`;

  return CODE; //.replace(/(\n|\t)/g, '').replace(/\s+/g, ' ');
}
