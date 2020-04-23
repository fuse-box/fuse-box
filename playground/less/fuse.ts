import * as path from 'path';
import { fusebox, pluginLess, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      entry: 'src/index.tsx',
      target: 'browser',
      webIndex: {
        template: 'src/index.html',
      },

      stylesheet: {
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: { root: './.cache' },

      devServer: true,
      hmr: true,
      plugins: [
        // pluginLess('*.less', {
        //   asModule: { scopeBehaviour: 'local' },
        // }),
      ],
      watcher: true,
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

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
