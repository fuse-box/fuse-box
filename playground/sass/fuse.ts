import * as path from 'path';
import { fusebox, pluginLess, pluginSass, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      entry: 'src/index.tsx',
      target: 'browser',
      webIndex: {
        embedIndexedBundles: true,
        template: 'src/index.html',
      },

      stylesheet: {
        autoImport: [{ file: 'src/resources/resources.scss' }],
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: true,
      plugins: [pluginSass('mod.scss', { asModule: {} })],

      hmr: true,
      watcher: true,

      devServer: true,
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev({ uglify: true, bundles: { app: 'app.js' } });
});

task('preview', async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false, bundles: { app: 'app.js' } });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
