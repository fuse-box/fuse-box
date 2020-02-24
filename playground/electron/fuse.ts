import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getMainConfig() {
    return fusebox({
      cache: { enabled: true, root: './.cache' },
      dependencies: { serverIgnoreExternals: true },
      entry: 'src/main/main.ts',
      logging: { level: 'succinct' },
      modules: ['node_modules'],
      target: 'server',
    });
  }

  getRendererConfig() {
    return fusebox({
      cache: { enabled: true, root: './.cache' },
      devServer: {
        hmrServer: { port: 7878 },
        httpServer: false,
      },
      electron: { nodeIntegration: true },
      entry: 'src/renderer/index.ts',
      logging: { level: 'succinct' },
      modules: ['node_modules'],
      target: 'electron',
      webIndex: {
        publicPath: './',
        template: 'src/renderer/index.html',
      },
    });
  }
}
const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  await rm('./dist');

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runDev({ bundles: { distRoot: 'dist/renderer', app: 'app.js' } });

  const electronMain = ctx.getMainConfig();

  const { onComplete } = await electronMain.runDev({ bundles: { distRoot: 'dist/main', app: 'app.js' } });
  onComplete(({ electron }) => electron.start());
});

task('dist', async ctx => {
  await rm('./dist');

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runProd({ bundles: { distRoot: 'dist/renderer', app: 'app.js' } });

  const electronMain = ctx.getMainConfig();

  const { onComplete } = await electronMain.runProd({
    bundles: {
      distRoot: 'dist/main',
      app: 'app.js',
      vendor: 'vendor.js',
    },
  });
  onComplete(({ electron }) => electron.start());
});
