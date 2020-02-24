import { fusebox, pluginReplace, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      //electron: { nodeIntegration: true },
      entry: 'src/index.ts',
      modules: ['./node_modules'],
      target: 'browser',

      cache: { enabled: true, root: './.cache' },
      devServer: this.runServer,
      watcher: true,
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },

      plugins: [pluginReplace('*', { hello: 'wadup' })],
    });
}
const { rm, task } = sparky<Context>(Context);

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
