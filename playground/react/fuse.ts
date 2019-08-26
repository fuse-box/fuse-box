import { sparky, fusebox } from '../../src';
import * as path from 'path';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      entry: 'src/index.tsx',
      webIndex: {
        template: 'src/index.html',
        embedIndexedBundles: true,
      },
      tsConfig: 'src/tsconfig.json',

      stylesheet: { paths: [path.join(__dirname, 'src/config')] },
      cache: false,

      watch: true,
      hmr: true,
      devServer: this.runServer && {
        open: false,
        httpServer: {
          express: app => {},
        },

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
const { task, exec } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
