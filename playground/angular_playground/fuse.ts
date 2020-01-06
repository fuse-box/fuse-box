import { fusebox, pluginAngular, pluginSass, sparky, pluginCSS } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      target: 'browser',
      entry: 'src/entry.ts',
      modules: ['./node_modules'],

      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },
      cache: { enabled: false, FTL: true, root: './.cache' },
      watch: true,
      sourceMap: false,
      devServer: this.runServer,

      plugins: [
        pluginAngular('*.component.ts'),
        pluginSass({ asText: true, useDefault: false }),
        pluginCSS('app*.css', { asText: true }),
      ],
    });
}
const { task, rm, exec } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
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
