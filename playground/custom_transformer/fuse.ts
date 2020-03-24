import * as path from 'path';
import { fusebox, pluginReplace, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getConfig = () =>
    fusebox({
      //electron: { nodeIntegration: true },
      cache: false,
      devServer: true,
      entry: 'src/index.ts',
      target: 'server',
      watcher: true,
    });
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  console.log('bitch');
  const transformer = fusebox({
    cache: false,
    dependencies: { serverIgnoreExternals: true },
    entry: 'transformer/index.ts',
    target: 'server',
    watcher: true,
  });
  console.log('here');
  const { onComplete } = await transformer.runDev({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'transformer.js', exported: true },
    },
  });
  onComplete(() => {
    console.log('done');
  });
  // onComplete(() => {
  //   const testApp = fusebox({
  //     dependencies: { serverIgnoreExternals: true },
  //     entry: 'src/index.ts',
  //     target: 'server',
  //     watcher: false,
  //   });
  //   testApp.runDev({ bundles: { app: 'app.js' } });
  // });
});

// task('default', async ctx => {
//   ctx.runServer = true;
//   const fuse = ctx.getConfig();
//   await fuse.runDev({ bundles: { app: 'app.js', styles: { path: 'styles/oi.css' } } });
// });

task('preview', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ bundles: { app: 'app.js' } });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
