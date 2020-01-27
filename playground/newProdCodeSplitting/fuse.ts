import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getFusebox = () =>
    fusebox({
      cache: false,
      devServer: true,
      entry: ['src/index.jsx', 'src/secondEntry.js'],
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
      app: 'app.js',
      distRoot: 'dist',
      vendor: 'vendor.$hash.js',
    },
  });
});

task('default', ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getFusebox();
  fuse.runDev({
    bundles: {
      app: 'app.js',
      distRoot: 'dist',
      vendor: 'vendor.$hash.js',
    },
  });
});
