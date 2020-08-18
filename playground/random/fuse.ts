import { fusebox, pluginReplace, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      //electron: { nodeIntegration: true },
      entry: 'src/index.ts',
      modules: ['modules'],

      compilerOptions: { emitDecoratorMetadata: true, experimentalDecorators: true },
      target: 'browser',

      //threading: { threadAmount: 1 },

      cache: { enabled: false, root: './.cache' },
      devServer: true,
      watcher: true,
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },

      //plugins: [pluginReplace('*', { hello: 'wadup' })],
    });
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev({ bundles: { app: 'app.js', styles: { path: 'styles/oi.css' } } });
});

task('preview', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ bundles: { app: 'app.js' } });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
