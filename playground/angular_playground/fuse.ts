import { fusebox, pluginAngular, pluginCSS, pluginSass, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      entry: 'src/entry.ts',
      modules: ['./node_modules'],
      target: 'browser',

      cache: { FTL: true, enabled: false, root: './.cache' },
      devServer: this.runServer,
      sourceMap: false,
      watch: true,
      webIndex: {
        publicPath: '.',
        template: 'src/index.html',
      },

      plugins: [
        pluginAngular('*.component.ts'),
        pluginSass({ asText: true, useDefault: false }),
        pluginCSS('app*.css', { asText: true }),
      ],
    });
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  console.log('oi');
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
