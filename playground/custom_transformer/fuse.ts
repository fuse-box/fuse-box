import * as path from 'path';
import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  const transformer = fusebox({
    cache: false,
    dependencies: { serverIgnoreExternals: true },
    entry: 'transformer/development.ts',
    target: 'server',
    watcher: { include: ['./src', './transformer'] },
  });

  const { onComplete } = await transformer.runDev({
    bundles: {
      exported: true,
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'transformer.js' },
    },
  });
  onComplete(({ server }) => server.start());
});
