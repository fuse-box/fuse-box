import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      cache: true,
      devServer: this.runServer,
      entry: 'src/index.ts',
      target: 'browser',
      webIndex: {
        template: 'src/index.html',
      },
    });
}
const { exec, rm, task } = sparky<Context>(Context);

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
  await fuse.runProd({ uglify: false });
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
