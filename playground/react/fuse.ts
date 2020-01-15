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

      stylesheet: { paths: [path.join(__dirname, 'src/config')] },
      cache: { root: './.cache', enabled: false },
      watch: true,
      hmr: true,
      logging: {
        level: 'succinct',
      },
      devServer: { httpServer: { port: 3000 } },
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
