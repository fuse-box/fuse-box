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
      },
      tsConfig: 'src/tsconfig.json',

      alias: { '^formik-wizard$': 'formik-wizard/dist/index.js' },
      stylesheet: { paths: [path.join(__dirname, 'src/config')] },
      cache: false,

      watch: true,
      hmr: true,
      logging: {
        level: 'succinct',
      },
      devServer: { httpServer: { port: 3000 } },
      // devServer: this.runServer && {
      //   open: false,
      //   httpServer: {
      //     express: app => {},
      //   },
      //   hmrServer: { useCurrentUrl: true },
      // },
    });
  }
}
const { task, rm, exec } = sparky<Context>(Context);

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
  await fuse.runProd({
    uglify: false,
    cleanCSS: {
      compatibility: {
        properties: { urlQuotes: true },
      },
    },
  });
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    // uglify: false,
    // screwIE: false,
    // cleanCSS: {
    //   compatibility: {
    //     properties: { urlQuotes: true },
    //   },
    // },
  });
});
