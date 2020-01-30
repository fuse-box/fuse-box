import * as dotenv from 'dotenv';
import * as path from 'path';
import { fusebox, sparky } from '../../src';

dotenv.config();

class Context {
  isProduction;
  runServer;

  getServer() {
    return fusebox({
      cache: {
        enabled: false,
        root: '.cache/server'
      },
      devServer: false,
      entry: 'src/server/index.js',
      modules: ['node_modules'],
      target: 'server'
    });
  }

  getClient() {
    return fusebox({
      cache: {
        enabled: false,
        root: '.cache/client'
      },
      devServer: !this.isProduction,
      entry: 'src/client/index.js',
      link: { useDefault: true },
      target: 'browser',
      webIndex: {
        publicPath: '/assets',
        template: 'src/client/index.html'
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
  await client.runDev();

  const server = ctx.getServer();
  await server.runDev();
});

task('dist', async ctx => {
  await rm('./dist');

  ctx.runServer = false;
  ctx.isProduction = true;

  const client = ctx.getClient();
  await client.runProd({
    bundles: {
      distRoot: path.join(__dirname, 'dist')
    }
  });

  const server = ctx.getServer();
  await server.runProd({
    bundles: {
      distRoot: path.join(__dirname, 'dist'),
      app: 'server.js'
      // serverEntry: 'myAwesomeServer.js'
    }
  });
});
