import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      dependencies: {
        ignoreAllExternal: false,
        ignorePackages: ['react'],
      },
      target: 'server',
      entry: 'src/index.ts',
      cache: false,
      watch: true,
      hmr: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
