import * as path from 'path';

import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: false,
      devServer: { httpServer: { port: 3000 } },
      entry: 'src/index.js',
      hmr: true,
      logging: {
        level: 'succinct',
      },
      target: 'browser',
      tsConfig: 'src/tsconfig.json',
      watch: true,
    });
  }
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    bundles: {
      root: path.join(__dirname, 'dist'),
      app: 'app.js',
    },
  });
});
