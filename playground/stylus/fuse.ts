import * as path from 'path';
import * as precss from 'precss';
import { fusebox, pluginLess, pluginPostCSS, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      entry: 'src/index.tsx',
      target: 'browser',
      tsConfig: 'src/tsconfig.json',
      webIndex: {
        template: 'src/index.html',
      },

      stylesheet: {
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: false,

      //plugins: [pluginLess('*.less', { asText: true, useDefault: true })],
      devServer: true,
      hmr: true,
      watch: true,
    });
  }
}
const { exec, rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: true });
});
task('dist', async ctx => {
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({ uglify: false });
});
