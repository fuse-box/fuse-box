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
const clientBundleOutput = {
  bundles: {
    app: 'app.js',
    distRoot: path.join(__dirname, 'dist/client'),
    vendor: 'vendor.js'
  }
};

const serverBundleOutput = {
  bundles: {
    app: 'server.js',
    distRoot: path.join(__dirname, 'dist/server'),
    serverEntry: 'myAwesomeServer.js'
  }
};

task('default', async ctx => {
  await rm('./dist');
  ctx.runServer = true;
  ctx.isProduction = false;

  const client = ctx.getClient();
  await client.runDev(clientBundleOutput);

  const server = ctx.getServer();
  const { onComplete } = await server.runDev(serverBundleOutput);
  onComplete(({ server }) => {
    server.start();
    // electron.start();
  });
});

task('dist', async ctx => {
  await rm('./dist');

  ctx.runServer = false;
  ctx.isProduction = true;

  const client = ctx.getClient();
  await client.runProd(clientBundleOutput);

  const server = ctx.getServer();
  const { onComplete } = await server.runProd(serverBundleOutput);
  onComplete(props => {
    console.log(props);
  });
});
