import { sparky, fusebox } from '../../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      output: '../dist/project',
      homeDir: '../',
      entry: 'project/src/index.ts',
      webIndex: {
        template: 'src/index.html',
      },
      cache: true,
      devServer: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  await rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
