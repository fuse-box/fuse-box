import { BundleType } from '../bundle/bundle';
import { createBundleRouter } from '../bundle/bundleRouter';
import { createServerProcess } from '../devServer/server';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { createServerEntry } from '../production/module/ServerEntry';
import { ISplitEntries } from '../production/module/SplitEntries';
import { IRunOnCompleteHandler, IRunResponse } from './IRunResponse';
import { Context } from './context';

interface IBuildProps {
  bundleContext: IBundleContext;
  ctx: Context;
  entries: Array<IModule>;
  modules: Array<IModule>;
  rebundle?: boolean;
  splitEntries?: ISplitEntries;
}

export const createBuild = async (props: IBuildProps): Promise<IRunResponse> => {
  const { bundleContext, ctx, entries, modules, rebundle, splitEntries } = props;

  const router = createBundleRouter({ ctx, entries });
  await router.init(modules);
  router.generateBundles(modules);

  if (splitEntries && splitEntries.entries.length > 0) {
    router.generateSplitBundles(splitEntries.entries);
  }

  const bundles = await router.writeBundles();

  // create a server bundle if we have more than 1 bundle in a server setup
  if (ctx.config.target === 'server' || ctx.config.target === 'electron') {
    const indexedTypes = [BundleType.JS_APP, BundleType.JS_VENDOR];
    let indexedAmount = 0;
    for (const item of bundles) {
      if (indexedTypes.includes(item.bundle.type)) indexedAmount++;
    }
    if (indexedAmount > 1) bundles.push(await createServerEntry(ctx, bundles));
  }

  // write the manifest
  const manifest = await router.writeManifest(bundles);

  if (bundleContext.cache && ctx.config.isDevelopment) await bundleContext.cache.write();
  ctx.isWorking = false;

  const onCompleteHandler: IRunOnCompleteHandler = {
    get electron() {
      return createServerProcess({ bundles, ctx, processName: require('electron') });
    },
    get server() {
      return createServerProcess({ bundles, ctx, processName: 'node' });
    },
  };

  const response: IRunResponse = {
    bundleContext,
    bundles,
    entries,
    manifest,
    modules,
    onComplete: handler => handler(onCompleteHandler),
    onWatch: userFn => {
      userFn(bundles);
      ctx.ict.on('rebundle', () => userFn(bundles));
    },
  };

  ctx.ict.sync(rebundle ? 'rebundle' : 'complete', response);

  return response;
};
