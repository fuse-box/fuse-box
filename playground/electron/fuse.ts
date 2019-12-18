import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getMainConfig() {
    return fusebox({
      cache: {
        enabled: true,
        root: '.cache/main',
      },
      dependencies: { ignoreAllExternal: true },
      entry: 'main.ts',
      homeDir: 'src/main',
      logging: { level: 'succinct' },
      output: 'dist/main/$name-$hash',
      target: 'electron',
      useSingleBundle: true,
    });
  }
  launch(handler) {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  }
  getRendererConfig() {
    return fusebox({
      cache: {
        enabled: false,
        root: '.cache/renderere',
      },
      dependencies: { include: ['tslib'] },
      devServer: {
        hmrServer: { port: 7878 },
        httpServer: false,
      },
      entry: 'index.ts',
      homeDir: 'src/renderer',
      logging: { level: 'succinct' },
      output: 'dist/renderer/$name-$hash',
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
  await rendererConfig.runDev();

  const electronMain = ctx.getMainConfig();
  await electronMain.runDev(handler => ctx.launch(handler));
});

task('dist', async ctx => {
  await rm('./dist');

  const rendererConfig = ctx.getRendererConfig();
  await rendererConfig.runProd({ uglify: false });

  const electronMain = ctx.getMainConfig();
  await electronMain.runProd({
    uglify: true,
    manifest: true,
    handler: handler => ctx.launch(handler),
  });
});
