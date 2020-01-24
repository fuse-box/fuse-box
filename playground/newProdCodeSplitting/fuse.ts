import { fusebox, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getFusebox = () => fusebox({
    cache: false,
    devServer: { httpServer: { port: 3000 } },
    entry: ['src/index.js', 'src/secondEntry.js'],
    hmr: true,
    logging: {
      level: 'succinct',
    },
    target: 'browser',
  });
}
const { rm, task } = sparky<Context>(Context);

task('default', ctx => {
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
