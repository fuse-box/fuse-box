import * as path from 'path';
import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: { enabled: true, root: './.cache' },
      devServer: { httpServer: { port: 3000 } },
      entry: 'src/index.tsx',
      //entry: 'src/edges.ts',
      hmr: true,
      logging: {
        level: 'succinct',
      },
      stylesheet: { paths: [path.join(__dirname, 'src/config')] },
      target: 'browser',
      webIndex: {
        template: 'src/index.html',
      },
    });
  }
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.js' },
    },
  });
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
