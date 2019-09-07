import { fusebox, sparky, pluginMinifyHtmlLiterals } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      target: 'browser',
      entry: 'src/index.ts',
      modules: ['./node_modules'],

      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },
      cache: false,
      watch: true,
      devServer: this.runServer,

      plugins: [pluginMinifyHtmlLiterals()],
    });
}
const { task, rm } = sparky<Context>(Context);

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
