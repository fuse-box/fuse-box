import { fusebox, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getMainConfig() {
    return fusebox({
      output: 'dist/main/$name-$hash',
      target: 'electron',
      homeDir: 'src/main',
      entry: 'main.ts',
      useSingleBundle: true,
      dependencies: { ignoreAllExternal: true },
      logging: { level: 'succinct' },
      cache: {
        enabled: true,
        root: '.cache/main',
      },
    });
  }
  launch(handler) {
    handler.onComplete(output => {
      output.electron.handleMainProcess();
    });
  }
  getRendererConfig() {
    return fusebox({
      output: 'dist/renderer/$name-$hash',
      target: 'electron',
      homeDir: 'src/renderer',
      entry: 'index.ts',
      dependencies: { include: ['tslib'] },
      logging: { level: 'succinct' },
      webIndex: {
        publicPath: './',
        template: 'src/renderer/index.html',
      },
      cache: {
        enabled: false,
        root: '.cache/renderere',
      },
      devServer: {
        httpServer: false,
        hmrServer: { port: 7878 },
      },
    });
  }
}
const { task, rm } = sparky<Context>(Context);

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
