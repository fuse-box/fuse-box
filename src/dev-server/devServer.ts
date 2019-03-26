import * as express from 'express';
import { BundleType } from '../bundle/Bundle';
import { Context } from '../core/Context';
import { ImportType } from '../resolver/resolver';
import { createDevServerConfig, IHMRServerProps, IHTTPServerProps } from './devServerProps';
import { createHMRServer, HMRServerMethods } from './hmrServer';

export interface IDevServerActions {
  clientSend: (name: string, payload) => void;
  onClientMessage: (fn: (name: string, payload) => void) => void;
}

export function createExpressApp(ctx: Context, props: IHTTPServerProps) {
  const app = express();
  app.use('/', express.static(props.root));
  app.use('*', (req, res) => {
    res.sendFile(props.fallback);
  });

  return app.listen(props.port, () => {
    ctx.log.status(`Development server is running at http://localhost:${props.port}`);
  });
}

export function createDevServer(ctx: Context): IDevServerActions {
  const ict = ctx.interceptor;

  const props = createDevServerConfig(ctx);

  if (!props.enabled) {
    return;
  }
  ctx.log.group('dev');
  const httpServerProps: IHTTPServerProps = props.httpServer as IHTTPServerProps;
  const hmrServerProps: IHMRServerProps = props.hmrServer as IHMRServerProps;

  // injecting some settings into the dev bundle
  if (hmrServerProps.enabled) {
    // injecting hmr dependency
    ict.on('assemble_fast_analysis', props => {
      const module = props.module;
      const pkg = module.pkg;
      if (pkg.isDefaultPackage && pkg.entry === module) {
        module.fastAnalysis.imports.push({ type: ImportType.REQUIRE, statement: 'fuse-box-hot-reload' });
      }
      return props;
    });

    ict.on('before_bundle_write', props => {
      const bundle = props.bundle;

      if (bundle.props.type === BundleType.PROJECT_JS) {
        const opts = { port: hmrServerProps.port };
        bundle.addContent(`FuseBox.import("fuse-box-hot-reload").connect(${JSON.stringify(opts)})`);
      }
      return props;
    });
  }

  let hmrServerMethods: HMRServerMethods;

  ict.on('complete', props => {
    if (httpServerProps.enabled) {
      const internalServer = createExpressApp(ctx, httpServerProps);
      // if the ports are the same, we mount HMR on the same server
      if (hmrServerProps.enabled && hmrServerProps.port === httpServerProps.port) {
        hmrServerMethods = createHMRServer({ internalServer, ctx, opts: hmrServerProps });
      }
    }
    if (hmrServerProps.enabled && !hmrServerMethods) {
      // which means that we require a separate HMR server on a different port
      hmrServerMethods = createHMRServer({ ctx, opts: hmrServerProps });
    }
    return props;
  });

  return {
    onClientMessage: (fn: (name: string, payload) => void) => {
      if (hmrServerMethods) {
        hmrServerMethods.onMessage(fn);
      }
    },
    clientSend: (name: string, payload) => {
      if (hmrServerMethods) {
        hmrServerMethods.sendEvent(name, payload);
      }
    },
  };
}
