import { fusebox, pluginMinifyHtmlLiterals, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      entry: 'src/index.ts',
      modules: ['./node_modules'],
      target: 'browser',

      cache: false,
      devServer: this.runServer,
      watch: true,
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },

      plugins: [pluginMinifyHtmlLiterals()],
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
