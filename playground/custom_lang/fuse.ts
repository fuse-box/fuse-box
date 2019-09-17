import { fusebox, sparky } from '../../src';
import { pluginCustomLang } from './pluginCustomLang';
class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      entry: 'src/index.ts',
      webIndex: {
        template: 'src/index.html',
      },

      cache: false,

      watch: true,
      hmr: true,
      logging: {
        level: 'succinct',
      },
      plugins: [pluginCustomLang()],
      devServer: true,
    });
  }
}
const { task, rm, exec } = sparky<Context>(Context);

task('default', async ctx => {
  ctx.runServer = true;
  const fuse = ctx.getConfig();
  await fuse.runDev();
});

task('preview', async ctx => {
  rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    uglify: false,
    cleanCSS: {
      compatibility: {
        properties: { urlQuotes: true },
      },
    },
  });
});
task('dist', async ctx => {
  rm('./dist');
  ctx.runServer = false;
  ctx.isProduction = true;
  const fuse = ctx.getConfig();
  await fuse.runProd({
    uglify: false,
    cleanCSS: {
      compatibility: {
        properties: { urlQuotes: true },
      },
    },
  });
});
