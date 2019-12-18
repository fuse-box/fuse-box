import * as path from 'path';
import { fusebox, pluginLink, sparky } from '../../src';
class Context {
  isProduction;
  runServer;
  getServerConfig() {
    return fusebox({
      cache: {
        enabled: false,
        root: '.cache/server',
      },
      codeSplitting: { scriptRoot: path.resolve(__dirname, './dist/server') },
      dependencies: { include: ['tslib'] },
      entry: 'src/server.tsx',
      output: 'dist/server/$name-$hash',
      target: 'server',
    });
  }
  getBrowserConfig() {
    return fusebox({
      entry: 'src/browser.tsx',
      output: 'dist/browser/$name-$hash',
      target: 'browser',

      dependencies: { include: ['tslib'] },
      link: { useDefault: true },
      webIndex: {
        publicPath: '/public',
        template: 'src/index.html',
      },

      cache: {
        enabled: false,
        root: '.cache/browser',
      },
      devServer: {
        hmrServer: { port: 7878 },
        httpServer: false,
      },
      watch: {
        chokidar: { usePolling: true },
      },
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  await rm('./dist');
  const browser = ctx.getBrowserConfig();
  await browser.runDev();

  const server = ctx.getServerConfig();
  await server.runDev();
});

task('preview', async ctx => {
  ctx.isProduction = true;
  await rm('./dist');
  const browser = ctx.getBrowserConfig();
  await browser.runProd({ uglify: true, manifest: true });

  const server = ctx.getServerConfig();
  const response = await server.runProd({ uglify: false, manifest: true });
  response.launcher.start();
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getBrowserConfig();
  await fuse.runProd({ uglify: false, manifest: true });
});
