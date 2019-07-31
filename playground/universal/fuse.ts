import { sparky, fusebox } from '../../src';
import * as path from 'path';
class Context {
  isProduction;
  runServer;
  getServerConfig() {
    return fusebox({
      output: 'dist/server/$name-$hash',
      target: 'server',
      entry: 'src/server.tsx',
      dependencies: { include: ['tslib'] },

      cache: {
        root: '.cache/server',
        enabled: true,
      },
      codeSplitting: { scriptRoot: path.resolve(__dirname, './dist/server') },
      watch: { ignored: ['./dist'] },
      devServer: false,
    });
  }
  getBrowserConfig() {
    return fusebox({
      output: 'dist/browser/$name-$hash',
      target: 'browser',
      entry: 'src/browser.tsx',

      dependencies: { include: ['tslib'] },
      webIndex: {
        publicPath: '/public',
        template: 'src/index.html',
      },
      cache: {
        root: '.cache/browser',
      },
      devServer: {
        httpServer: false,
        hmrServer: { port: 7878 },
      },
      watch: { ignored: ['./dist'] },
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

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
  await browser.runProd({ uglify: true });

  const server = ctx.getServerConfig();
  const response = await server.runProd({ uglify: false });
  response.launcher.start();
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getBrowserConfig();
  await fuse.runProd({ uglify: false });
});
