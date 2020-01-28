import { ITarget } from '../config/ITarget';
import { readFile } from '../utils/utils';

export const BUNDLE_RUNTIME_NAMES = {
  ARG_REQUIRE_FUNCTION: '__fusereq',
  BUNDLE_FUNCTION: 'bundle',
  GLOBAL_OBJ: '__fuse',
  INTEROP_REQUIRE_DEFAULT_FUNCTION: 'dt',
  REQUIRE_FUNCTION: 'r',
};

export type ICodeSplittingMap = {
  b: Record<number, { p: string }>;
};

export interface IBundleRuntimeCore {
  codeSplittingMap?: ICodeSplittingMap;
  interopRequireDefault?: boolean;
  isIsolated?: boolean;
  target: ITarget;
  typescriptHelpersPath?: string;
}

const INTEROP_DEFAULT = BUNDLE_RUNTIME_NAMES.INTEROP_REQUIRE_DEFAULT_FUNCTION;

function getCodeSplittingFunction(target: ITarget) {
  if (target === 'browser') {
    return `function lb(id, conf) {
  return new Promise(function(resolve, reject) {
    if (!conf.fns) {
      conf.fns = [resolve];
      var script = document.createElement('script');
      document.head.appendChild(script);
      script.onload = function() {
        if (modules[id]) {
          conf.fns.map(x => x(f.r(id)));
        } else reject('Resolve error of module ' + id + ' at path ' + conf.p);
        conf.fns = void 0;
      };
      script.src = conf.p;
    } else conf.fns.push(resolve);
  });
}`;
  }
  if (target === 'server') {
    return `function lb(id, conf) {
return new Promise(function(resolve, reject) {
  require(require('path').resolve(__dirname, conf.p));
if (modules[id]) {
  return resolve(f.r(id));
} else reject('Resolve error of module ' + id + ' at path ' + conf.p);
});
};`;
  }
  return '';
}

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
    optional += `f.${INTEROP_DEFAULT} = function (x) { return x !== undefined && x.default !== undefined ? x.default : x; };\n`;
  }
  if (props.codeSplittingMap) {
    optional += `\nvar cs = ${JSON.stringify(props.codeSplittingMap)};`;
    optional += '\n' + getCodeSplittingFunction(props.target);
  }

  let CODE = `${isIsolated ? `var ${BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ} = ` : ''}(function() {
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
      ${props.codeSplittingMap ? 'var s = cs.b[id]; if (s) return lb(id, s);' : ''}
      throw new Error('Module ' + id + ' was not found');
    }
    cached = f.c[id] = {};
    cached.exports = {};
    cached.m = { exports: cached.exports };
    module(f.${BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION}, cached.exports, cached.m);
    return cached.m.exports;
  }; ${isIsolated ? '\n\treturn f;' : ''}
})();`;

  if (props.typescriptHelpersPath) {
    const tsHelperContents = readFile(props.typescriptHelpersPath);
    CODE += '\n' + tsHelperContents;
  }

  return CODE;
}
