import * as path from 'path';
import { fusebox, pluginAngular, pluginCSS, pluginSass, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      //compilerOptions: { tsConfig: 'sdfsd.json' },
      entry: 'src/entry.ts',
      modules: ['./node_modules'],
      target: 'browser',

      cache: { FTL: true, enabled: true, root: './.cache' },
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

  await fuse.runDev({
    bundles: {
      root: path.join(__dirname, 'dist'),
      app: 'app.js',
    },
  });
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
