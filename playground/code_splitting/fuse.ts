import { fusebox, sparky } from '../../src';
import { ITarget } from '../../src/config/ITarget';
class Context {
  isProduction;
  runServer;
  target: ITarget = 'browser';
  getConfig = () =>
    fusebox({
      cache: { enabled: false, root: './.cache' },
      devServer: this.runServer,
      entry: 'src/index.ts',
      target: this.target,

      webIndex: {
        template: 'src/index.html',
      },
    });
}
const { rm, task } = sparky<Context>(Context);

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
  await fuse.runProd({ uglify: false });
});

task('preview-server', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.target = 'server';
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  const { onComplete } = await fuse.runProd();
  onComplete(({ server }) => server.start());
});

task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
