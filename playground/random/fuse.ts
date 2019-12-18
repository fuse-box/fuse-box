import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      entry: 'src/index.ts',
      modules: ['./node_modules'],
      target: 'browser',

      cache: { enabled: true, root: './.cache' },
      devServer: this.runServer,
      watch: true,
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },

      plugins: [],
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
