import { sparky, fusebox } from '../../src';
import * as path from 'path';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      entry: 'src/index.ts',
      webIndex: {
        template: 'src/index.html',
      },
      cache: false,
      devServer: this.runServer && {
        open: false,
        proxy: [
          {
            path: '/api',
            options: {
              target: 'https://jsonplaceholder.typicode.com',
              changeOrigin: true,
              pathRewrite: {
                '^/api': '/',
              },
            },
          },
        ],
      },
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task('default', async ctx => {
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
