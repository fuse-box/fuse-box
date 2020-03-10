import { ITarget } from '../config/ITarget';
import { IModule } from '../moduleResolver/module';
import { Concat, fastHash, getFileModificationTime } from '../utils/utils';
import { BUNDLE_RUNTIME_NAMES, ICodeSplittingMap } from './bundleRuntimeCore';

export interface IBundleSourceProps {
  isCSS?: boolean;
  isProduction?: boolean;
  target: ITarget;
  withSourcemaps?: boolean;
}

export interface IBundleGenerateProps {
  isIsolated?: boolean;
  runtimeCore: string;
}

export type BundleSource = {
  codeSplittingMap?: ICodeSplittingMap;
  containsMaps?: boolean;
  entries: Array<IModule>;
  expose?: Array<{ name: string; moduleId: number }>;
  injection?: Array<string>;
  modules: Array<IModule>;
  generate: (opts: IBundleGenerateProps) => Concat;
  generateHash: () => string;
};

const FuseName = BUNDLE_RUNTIME_NAMES.GLOBAL_OBJ;
const BundleFN = FuseName + '.' + BUNDLE_RUNTIME_NAMES.BUNDLE_FUNCTION;
const ReqFn = FuseName + '.' + BUNDLE_RUNTIME_NAMES.REQUIRE_FUNCTION;

export function createBundleSource(props: IBundleSourceProps): BundleSource {
  function generateCSS(self: BundleSource, opts: IBundleGenerateProps): Concat {
    const concat = new Concat(true, '', '\n');
    const totalAmount = self.modules.length;
    let index = 0;
    while (index < totalAmount) {
      const module = self.modules[index];
      const cssData = module.css;

      if (cssData) {
        concat.add(module.publicPath, cssData.css, module.isSourceMapRequired ? cssData.map : undefined);
        if (module.isSourceMapRequired && cssData.map) {
          self.containsMaps = true;
        }
      }
      index++;
    }
    return concat;
  }
  const self: BundleSource = {
    containsMaps: false,
    entries: [],
    injection: [],
    // user injection
    // for example inject some code after the bundle is ready

    modules: [],
    generate: (opts: IBundleGenerateProps) => {
      if (props.isCSS) return generateCSS(self, opts);
      const concat = new Concat(true, '', '\n');

      // start the wrapper for the entire bundle if required
      if (opts.isIsolated) concat.add(null, `(function(){`);

      // adding core api if required
      if (opts.runtimeCore) concat.add(null, opts.runtimeCore);

      concat.add(null, BundleFN + '({');

      let index = 0;
      const totalAmount = self.modules.length;
      while (index < totalAmount) {
        const module = self.modules[index];
        const isLast = index + 1 === totalAmount;
        if (!props.isProduction) concat.add(null, `\n// ${module.publicPath} @${module.id}`);

        concat.add(null, module.id + `: function(${BUNDLE_RUNTIME_NAMES.ARG_REQUIRE_FUNCTION}, exports, module){`);
        if (module.isSourceMapRequired && module.sourceMap) {
          self.containsMaps = true;
        }
        if (module.contents) {
          concat.add(null, module.contents, module.isSourceMapRequired ? module.sourceMap : undefined);
        }
        concat.add(null, '}' + (isLast ? '' : ','));
        index++;
      }

      let injectionCode = [];
      // add entries
      // e.g __fuse.r(1)
      if (self.entries) {
        for (const entry of self.entries) {
          injectionCode.push(ReqFn + '(' + entry.id + ')');
        }
      }

      // add exposed variables
      // for example on nodejs that will be "exports" on browser "window"
      if (self.expose) {
        let exposedGlobal;
        if (props.target === 'browser' || props.target === 'electron') exposedGlobal = 'window';
        else if (props.target === 'server') exposedGlobal = 'exports';
        // we cannot expose on web-worker target
        if (exposedGlobal) {
          for (const item of self.expose) {
            injectionCode.push(`${exposedGlobal}[${JSON.stringify(item.name)}] = ${ReqFn + '(' + item.moduleId + ')'}`);
          }
        }
      }

      if (self.injection.length) {
        for (const userInjectionLine of self.injection) injectionCode.push(userInjectionLine);
      }

      let readyFunction = '';
      if (injectionCode.length) readyFunction = `, function(){\n` + injectionCode.join('\n') + '\n}';

      concat.add(null, '}' + readyFunction + ')');
      // end the isolation
      if (opts.isIsolated) concat.add(null, `})()`);
      return concat;
    },
    generateHash: () => {
      let str = '';
      for (const module of self.modules) {
        str += getFileModificationTime(module.absPath).toString();
      }
      return fastHash(str);
    },
  };
  return self;
}
