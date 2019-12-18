import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      allowSyntheticDefaultImports: true,
      cache: false,
      dependencies: { ignoreAllExternal: false },
      entry: 'src/index.ts',
      hmr: true,
      modules: ['packages'],
      output: './dist/$hash-$name',
      target: 'server',
      watch: true,
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  const fuse = ctx.getConfig();
  await fuse.runDev(handler => {
    handler.onComplete(output => {
      output.server.handleEntry({ nodeArgs: [], scriptArgs: [] });
    });
  });
});

task('preview', async ctx => {
  rm('./dist');

  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    uglify: true,
    handler: handler => {
      handler.onComplete(output => {
        output.server.handleEntry({ nodeArgs: [], scriptArgs: [] });
      });
    },
  });
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
