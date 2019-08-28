import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      target: 'browser',
      entry: 'src/index.js',
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },
      cache: false,
      watch: true,
      devServer: this.runServer,
    });
}
const { task, rm, exec } = sparky<Context>(Context);

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
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
