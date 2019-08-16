import { sparky, fusebox, pluginPostCSS, pluginReplace } from '../../src';
import * as path from 'path';
import * as precss from 'precss';
import * as modulesScope from 'postcss-modules-scope';

class Context {
  isProduction;
  runServer;
  getConfig() {
    return fusebox({
      target: 'browser',
      entry: 'src/index.tsx',
      webIndex: {
        template: 'src/index.html',
        embedIndexedBundles: true,
      },
      tsConfig: 'src/tsconfig.json',

      stylesheet: {
        paths: [path.join(__dirname, 'src/config')],
      },

      cache: {
        root: '.cache/fusebox/client',
        enabled: false,
      },

      watch: true,
      hmr: true,

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
      devServer: true,
    });
  }
}
const { task, exec, rm } = sparky<Context>(Context);

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
