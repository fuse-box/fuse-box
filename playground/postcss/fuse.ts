import * as path from 'path';
import * as modulesScope from 'postcss-modules-scope';
import * as precss from 'precss';
import { fusebox, pluginPostCSS, pluginReplace, sparky } from '../../src';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      entry: 'src/index.tsx',
      target: 'browser',
      tsConfig: 'src/tsconfig.json',
      webIndex: {
        embedIndexedBundles: true,
        template: 'src/index.html',
      },

      stylesheet: {
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: {
        enabled: false,
        root: '.cache/fusebox/client',
      },

      hmr: true,
      watch: true,

      devServer: true,
      plugins: [
        pluginReplace('index.ts', { __CLIENT__: true, __SERVER__: false }),
        pluginPostCSS('src/*.css', {
          stylesheet: {
            postCSS: {
              plugins: [
                precss(/* options */),
                modulesScope({
                  getJSON: function(cssFileName, json, outputFileName) {
                    console.log(arguments);
                  },
                }),
              ],
            },
          },
        }),
      ],
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
