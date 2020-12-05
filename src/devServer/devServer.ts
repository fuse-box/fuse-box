import * as express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import * as open from 'open';
import { createGlobalModuleCall } from '../bundleRuntime/bundleRuntimeCore';
import { Context } from '../core/context';
import { IModule } from '../moduleResolver/module';
import {
  createDevServerConfig,
  IHMRServerProps,
  IHTTPServerProps,
  IOpenProps,
  IProxyCollection,
} from './devServerProps';
import { HMRServerMethods, createHMRServer } from './hmrServer';

export interface IDevServerActions {
  clientSend: (name: string, payload, ws_instance?: WebSocket) => void;
  onClientMessage: (fn: (name: string, payload) => void) => void;
}

interface ICreateReactAppExtraProps {
  openProps?: IOpenProps;
  proxyProps?: Array<IProxyCollection>;
}

export function createExpressApp(ctx: Context, props: IHTTPServerProps, extra?: ICreateReactAppExtraProps) {
  const app = express();
  // app.all('/__ftl', (req, res) => {
  //   const ftlModules = ctx.assembleContext.getFTLModules();
  //   const js = generateFTLJavaScript(ftlModules);
  //   res.set('Content-Type', 'application/javascript; charset=UTF-8');
  //   res.send(js);
  // });
  if (props.express) props.express(app, express);
  function logProvider(p) {
    return {
      debug: (msg) => {
        ctx.log.info('proxy', msg);
      },
      error: (msg) => ctx.log.error(msg),
      info: (msg) => {
        ctx.log.info('proxy', msg);
      },
      log: (msg) => {
        ctx.log.info('proxy', msg);
      },
      warn: (msg) => ctx.log.warn(msg),
    };
  }

  if (extra && extra.proxyProps) {
    for (const item of extra.proxyProps) {
      item.options.logProvider = logProvider;
      app.use(item.path, createProxyMiddleware(item.options));
    }
  }

  app.use('/', express.static(props.root));

  app.use('*', (req, res) => {
    res.sendFile(props.fallback);
  });

  const server = app.listen(props.port, () => {
    if (extra && extra.openProps) {
      extra.openProps.target = extra.openProps.target || `http://localhost:${props.port}`;
      open(extra.openProps.target, extra.openProps);
    }
    ctx.log.clearLine();
    ctx.log.info('development', `Development server is running at <bold>http://localhost:$port</bold>`, {
      port: props.port,
    });
  });

  if (server) {
    server.on('error', (err) => {
      ctx.fatal('An error occurred while trying to start the devServer.', [err.message]);
    });
  }

  return server;
}

export function createDevServer(ctx: Context): IDevServerActions {
  const ict = ctx.ict;

  const props = createDevServerConfig(ctx);

  if (!props.enabled) {
    return;
  }

  const httpServerProps: IHTTPServerProps = props.httpServer as IHTTPServerProps;
  const hmrServerProps: IHMRServerProps = props.hmrServer as IHMRServerProps;

  const isProduction = !!ctx.config.isProduction;

  let openProps: IOpenProps;
  if (props.open) {
    if (typeof props.open === 'boolean') {
      openProps = {};
    }
    if (typeof props.open === 'object') {
      openProps = props.open;
    }
  }

  let proxyProps: Array<IProxyCollection>;
  if (props.proxy) {
    proxyProps = props.proxy;
  }

  // injecting some settings into the dev bundle
  if (hmrServerProps.enabled) {
    // injecting hmr dependency
    if (!isProduction) {
      const clientProps: any = {};
      if (hmrServerProps.connectionURL) {
        clientProps.connectionURL = hmrServerProps.connectionURL;
      } else {
        if (hmrServerProps.useCurrentURL || httpServerProps.port === hmrServerProps.port) {
          clientProps.useCurrentURL = true;
        } else if (hmrServerProps.port) {
          clientProps.port = hmrServerProps.port;
        }
      }
      ict.on('before_bundle_write', (props) => {
        const { bundle } = props;
        const bundleContext = ctx.bundleContext;

        if (bundle.containsApplicationEntryCall) {
          let fuseBoxHotReload: IModule;
          for (const absPath in bundleContext.modules) {
            if (absPath.includes('fuse-box-hot-reload')) {
              fuseBoxHotReload = bundleContext.modules[absPath];
              break;
            }
          }
          if (fuseBoxHotReload) {
            const requireLine = 'const hmr = ' + createGlobalModuleCall(fuseBoxHotReload.id);
            bundle.source.injection.push(requireLine);
            bundle.source.injection.push(`hmr.connect(${JSON.stringify(clientProps)})`);
          }
        }
      });
    }
  }

  let hmrServerMethods: HMRServerMethods;
  let onMessageCallbacks: Array<(name: string, payload) => void> = [];

  ict.on('complete', (props) => {
    if (httpServerProps.enabled) {
      const internalServer = createExpressApp(ctx, httpServerProps, { openProps, proxyProps });

      // if the ports are the same, we mount HMR on the same server
      if (hmrServerProps.enabled && hmrServerProps.port === httpServerProps.port && !isProduction) {
        hmrServerMethods = createHMRServer({ ctx, internalServer, opts: hmrServerProps });
      }
    }
    if (hmrServerProps.enabled && !hmrServerMethods && !isProduction) {
      // which means that we require a separate HMR server on a different port
      hmrServerMethods = createHMRServer({ ctx, opts: hmrServerProps });
    }
    if (onMessageCallbacks.length && hmrServerMethods) {
      onMessageCallbacks.map((cb) => hmrServerMethods.onMessage(cb));
      onMessageCallbacks = [];
    }

    return props;
  });

  return {
    clientSend: (name: string, payload, ws_instance?: WebSocket) => {
      if (hmrServerMethods) {
        hmrServerMethods.sendEvent(name, payload, ws_instance);
      }
    },
    onClientMessage: (fn: (name: string, payload, ws_instance?: WebSocket) => void) => {
      if (hmrServerMethods) {
        hmrServerMethods.onMessage(fn);
      } else {
        // if the server isn't ready store it here
        onMessageCallbacks.push(fn);
      }
    },
  };
}
