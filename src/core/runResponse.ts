import { IBundleRouter } from '../bundle/bundleRouter';
import { createServerProcess, IServerProcess } from '../devServer/server';
import { createServerEntry } from '../production/module/ServerEntry';
import { Context } from './context';

export const createRunResponse = async (ctx: Context, router: IBundleRouter) => {
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

  return {
    bundles,
    manifest,
    onComplete: handler =>
      handler({
        electron,
        server,
      }),
  };
};
