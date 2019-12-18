import * as path from 'path';
import { fusebox, pluginWebWorker, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: { root: './.cache' },
      devServer: this.runServer && {
        open: false,
        proxy: [
          {
            options: {
              changeOrigin: true,
              pathRewrite: {
                '^/api': '/',
              },
              target: 'https://jsonplaceholder.typicode.com',
            },
            path: '/api',
          },
        ],
      },
      entry: 'src/index.ts',
      plugins: [pluginWebWorker()],
      target: 'browser',
      webIndex: {
        template: 'src/index.html',
      },
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  await rm('./dist');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  await rm('./dist');
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
