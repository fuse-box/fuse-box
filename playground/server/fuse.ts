import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      output: './dist/$hash-$name',
      target: 'server',
      entry: 'src/index.ts',
      cache: false,
      modules: ['packages'],
      allowSyntheticDefaultImports: true,
      dependencies: { ignoreAllExternal: false },
      watch: true,
      hmr: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

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
