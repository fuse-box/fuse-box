import { Context } from '../core/Context';
import { IModule } from '../moduleResolver/Module';
import { Bundle, IBundle, IBundleType, IBundleWriteResponse } from './bundle';

export interface IBundleRouter {
  dispatchModules: (modules: Array<IModule>) => void;
  writeBundles: () => Promise<Array<IBundleWriteResponse>>;
}

export interface IBundleRouteProps {
  ctx: Context;
  entries: Array<IModule>;
}

export function BundleRouter(props: IBundleRouteProps): IBundleRouter {
  const { ctx } = props;
  const ict = ctx.ict;
  const bundles: Array<IBundle> = [];

  const outputConfig = ctx.outputConfig;

  let mainBundle: IBundle;
  function getBundle(module: IModule): IBundle {
    if (!mainBundle)
      mainBundle = Bundle({
        bundleConfig: outputConfig.app,
        ctx: ctx,
        entries: props.entries,
        includeAPI: true,
        type: IBundleType.JS_APP,
      });
    return mainBundle;
  }

  function dispatch(module: IModule) {
    const bundle = getBundle(module);

    if (!module.isCached) {
      ict.sync('bundle_resolve_module', { module: module });
    }
    bundle.source.modules.push(module);
  }

  const scope: IBundleRouter = {
    dispatchModules: (modules: Array<IModule>) => {
      for (const module of modules) dispatch(module);
    },
    writeBundles: async () => {
      return await mainBundle.generate();
    },
  };
  return scope;
}
