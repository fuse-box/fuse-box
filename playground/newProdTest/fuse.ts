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
      tsConfig: 'src/tsconfig.json',
      cache: false,
      modules: ['./modules'],
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
  await fuse.runProd();
});
