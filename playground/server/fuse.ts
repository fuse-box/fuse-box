import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: false,
      entry: 'src/index.ts',
      hmr: true,
      modules: ['packages'],
      target: 'server',
      watcher: true,
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  const fuse = ctx.getConfig();
  const { onComplete } = await fuse.runDev();
  onComplete(({ server }) => {
    server.start();
  });
});

task('preview', async ctx => {
  rm('./dist');

  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  const { onComplete } = await fuse.runProd();
  onComplete(({ server }) => server.start());
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
