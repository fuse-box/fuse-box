import * as path from 'path';
import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: false,
      devServer: { httpServer: { port: 3000 } },
      entry: 'src/index.ts',
      hmr: true,
      logging: {
        level: 'succinct',
      },
      modules: ['./modules'],
      target: 'browser',
      tsConfig: 'src/tsconfig.json',
      watch: true,
      webIndex: {
        template: 'src/index.html',
      },
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runProd();
});
