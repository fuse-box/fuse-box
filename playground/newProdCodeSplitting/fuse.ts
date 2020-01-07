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
const { task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runProd();
});
