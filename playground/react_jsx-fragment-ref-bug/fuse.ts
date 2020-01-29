import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      cache: false,
      devServer: true,
      entry: 'src/index.jsx',
      hmr: true,
      logging: {
        level: 'succinct',
      },
      target: 'browser',
      webIndex: {
        template: 'src/index.html',
      },
    });
  }
}

const { task } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.isProduction = false;
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});
