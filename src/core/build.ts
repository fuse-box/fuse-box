import { createBundleRouter } from '../bundle/bundleRouter';
import { createServerProcess, IServerProcess } from '../devServer/server';
import { IBundleContext } from '../moduleResolver/bundleContext';
import { IModule } from '../moduleResolver/module';
import { createServerEntry } from '../production/module/ServerEntry';
import { ISplitEntries } from '../production/module/SplitEntries';
import { IRunResponse } from './IRunResponse';
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
  router.generateBundles(modules);

  if (splitEntries && splitEntries.entries.length > 0) {
    router.generateSplitBundles(splitEntries.entries);
  }

  await ctx.ict.resolve();

  const bundles = await router.writeBundles();
  let server: IServerProcess;
  let electron: IServerProcess;

  // create a server bundle if we have more than 1 bundle in a server setup
  if (ctx.config.target === 'server' || ctx.config.target === 'electron') {
    if (bundles.length > 1) bundles.push(await createServerEntry(ctx, bundles));
    if (ctx.config.target === 'server') server = createServerProcess(ctx, bundles);
    if (ctx.config.target === 'electron') electron = createServerProcess(ctx, bundles);
  }

  // write the manifest
  const manifest = await router.writeManifest(bundles);

  if (bundleContext.cache && ctx.config.isDevelopment) await bundleContext.cache.write();
  ctx.isWorking = false;

  const response: IRunResponse = {
    bundleContext,
    bundles,
    entries,
    manifest,
    modules,
    onComplete: handler =>
      handler({
        electron,
        server,
      }),
  };

  ctx.ict.sync(rebundle ? 'rebundle' : 'complete', response);

  return response;
};
