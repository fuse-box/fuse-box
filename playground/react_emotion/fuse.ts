import * as path from 'path';
import { fusebox, pluginCSSInJSX, sparky } from '../../src';

class Context {
  isProduction;
  runServer;

  getClient() {
    return fusebox({
      cache: {
        enabled: true,
        root: '.cache/client'
      },
      devServer: {
        hmrServer: { port: 7878 },
        httpServer: true,
        open: false
      },
      entry: 'src/index.js',
      link: { resourcePublicRoot: 'resources' },
      modules: ['./node_modules'],
      plugins: [
        pluginCSSInJSX({
          autoInject: true,
          autoLabel: true,
          cssPropOptimization: true,
          emotionCoreAlias: '@emotion/core',
          jsxFactory: 'jsx',
          labelFormat: '[dirname]--[local]',
          sourceMap: true,
          test: /src\/(.*?)\.(js|jsx|ts|tsx)$/
        })
      ],
      sourceMap: !this.isProduction,
      target: 'browser',
      webIndex: {
        publicPath: '/',
        template: 'src/index.html'
      }
    });
  }
}

const { rm, task } = sparky<Context>(Context);

task('default', async ctx => {
  await rm('./dist');

  ctx.runServer = true;
  ctx.isProduction = false;

  const client = ctx.getClient();
  await client.runDev({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.js', publicPath: '/' }
    }
  });
});

task('dist', async ctx => {
  await rm('./dist');

  ctx.runServer = false;
  ctx.isProduction = true;

  const client = ctx.getClient();
  await client.runProd({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: { path: 'app.js' }
    }
  });
});
