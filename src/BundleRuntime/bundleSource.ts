import { ITarget } from '../config/PrivateConfig';
import { IBundleRuntimeCore, bundleRuntimeCore, BUNDLE_RUNTIME_NAMES } from './bundleRuntimeCore';
import { IModule } from '../ModuleResolver/Module';
import { Concat } from '../utils/utils';

export interface IBundleSourceProps {
  core?: IBundleRuntimeCore;
  target: ITarget;
  isIsolated?: boolean;

  withSourcemaps?: boolean;
}

const FuseName = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ;
const BundleFN = FuseName + '.' + BUNDLE_RUNTIME_NAMES.BUNDLE_FUNCTION;
const ReqFn = FuseName + '.' + BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION;

export function bundleSource(props: IBundleSourceProps) {
  const isIsolated = props.target === 'web-worker' || props.isIsolated;

  const modules: Array<IModule> = [];
  let entries: Array<IModule> = [];
  let injection: string;
  let expose: Array<{ name: string; moduleId: number }>;
  const scope = {
    modules,
    entries,
    expose,
    // user injection
    // for example inject some code after the bundle is ready
    injection,
    generate: () => {
      const concat = new Concat(props.withSourcemaps, '', '\n');
      // start the wrapper for the entire bundle if required
      if (isIsolated) concat.add(null, `(function(){`);

      // adding core api if required
      if (props.core) concat.add(null, bundleRuntimeCore(props.core));

      concat.add(null, BundleFN + '({');

      let index = 0;
      const totalAmount = scope.modules.length;
      while (index < totalAmount) {
        const module = scope.modules[index];
        const isLast = index + 1 === totalAmount;
        if (module.contents) {
          if (module.publicPath) {
            concat.add(null, `\n// module-${module.id} ${module.publicPath}`);
          }
          concat.add(null, module.id + ': function(exports, module){');
          concat.add(
            props.withSourcemaps ? module.publicPath : null,
            module.contents,
            props.withSourcemaps ? module.sourceMap : undefined,
          );
          concat.add(null, '}' + (isLast ? '' : ','));
        }
        index++;
      }

      let injectionCode = [];
      // add entries
      // e.g __fuse.r(1)
      if (scope.entries) {
        for (const entry of scope.entries) {
          injectionCode.push(ReqFn + '(' + entry.id + ')');
        }
      }

      // add exposed variables
      // for example on nodejs that will be "exports" on browser "window"
      if (scope.expose) {
        let exposedGlobal;
        if (props.target === 'browser' || props.target === 'electron') exposedGlobal = 'window';
        else if (props.target === 'server') exposedGlobal = 'exports';
        // we cannot expose on web-worker target
        if (exposedGlobal) {
          for (const item of scope.expose) {
            injectionCode.push(`${exposedGlobal}[${JSON.stringify(item.name)}] = ${ReqFn + '(' + item.moduleId + ')'}`);
          }
        }
      }

      let readyFunction = '';
      if (injectionCode.length) readyFunction = `, function(){\n` + injectionCode.join('\n') + '\n}';

      concat.add(null, '}' + readyFunction + ')');
      // end the isolation
      if (isIsolated) concat.add(null, `})()`);
      return concat;
    },
  };
  return scope;
}
