import * as path from 'path';
import { fusebox, pluginAngular, pluginCSS, pluginSass, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      //compilerOptions: { tsConfig: 'sdfsd.json' },
      cache: { enabled: true, root: './.cache', strategy: 'fs' },
      devServer: this.runServer,
      entry: 'src/entry.ts',
      modules: ['./node_modules'],
      sourceMap: { project: true, vendor: false },
      target: 'browser',
      //threading: { minFileSize: 2000, threadAmount: 1 },
      watcher: true,
      webIndex: {
        publicPath: '/',
        template: 'src/index.html',
      },

      plugins: [
        pluginAngular('*.component.ts'),
        pluginSass('*.component.scss', { asText: true, useDefault: false }),
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
      distRoot: path.join(__dirname, 'dist'),
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
