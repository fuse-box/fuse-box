import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getFusebox = () =>
    fusebox({
      cache: false,
      devServer: false,
      entry: ['src/index.tsx'],
      logging: {
        level: 'succinct',
      },
      target: 'browser',
      webIndex: true,
    });
}
const { rm, task } = sparky<Context>(Context);

task('dist', ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getFusebox();
  fuse.runProd({
    bundles: {
      app: {
        path: 'myapp.js',
      },
      codeSplitting: {
        path: 'other/$name.$hash.js',
      },
      distRoot: 'dist',
      vendor: 'vendor.$hash.js',
    },
  });
});

task('default', ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = false;
  const fuse = ctx.getFusebox();
  fuse.runDev({
    bundles: { app: { path: 'app.js', publicPath: './bundles/' } },
  });
});
