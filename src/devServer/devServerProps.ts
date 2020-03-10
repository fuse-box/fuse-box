import * as path from 'path';
import { Context } from '../core/context';

export type IDevServerProxy = {
  [key: string]: {
    target?: string;
    changeOrigin?: boolean;
    pathRewrite?: { [key: string]: string };
  };
};

export interface IHMRServerProps {
  connectionURL?: string;
  enabled?: boolean;
  port?: number;
  useCurrentURL?: boolean;
}
export interface IHTTPServerProps {
  enabled?: boolean;
  fallback?: string;
  port?: number;
  root?: string;
  express?: (app: any, express: any) => void;
}

export interface IOpenProps {
  app?: Array<string> | string;
  background?: boolean; // mac os only
  target?: string;
  wait?: boolean;
}
export interface IProxyCollection {
  options: any;
  path: string;
}
export interface IDevServerProps {
  enabled?: boolean;
  hmrServer?: IHMRServerProps | boolean;
  httpServer?: IHTTPServerProps | boolean;
  open?: IOpenProps | boolean;
  proxy?: Array<IProxyCollection>;
}

export function createDevServerConfig(ctx: Context): IDevServerProps {
  const isProduction = ctx.config.isProduction;
  const iServer = ctx.config.target === 'server';
  let props = ctx.config.devServer;
  let enabled = false;
  // use can just ignore this option or set it to false
  if (props === false || props === undefined) {
    return { enabled };
  }
  // enable everything is case of true
  if (props === true) {
    props = { enabled: true, hmrServer: {}, httpServer: {} };
  }

  // we allow only objects here
  if (typeof props !== 'object') {
    props = {};
  }

  props.enabled = props.enabled !== undefined ? props.enabled : true;

  if (typeof props.hmrServer === 'boolean') {
    props.hmrServer = { enabled: props.hmrServer };
  } else if (typeof props.hmrServer === 'object') {
    props.hmrServer.enabled = props.hmrServer.enabled !== undefined ? props.hmrServer.enabled : true;
  } else {
    props.hmrServer = { enabled: true };
  }
  if (typeof props.httpServer === 'boolean') {
    props.httpServer = { enabled: props.httpServer };
  } else if (typeof props.httpServer === 'object') {
    props.httpServer.enabled = props.httpServer.enabled !== undefined ? props.httpServer.enabled : true;
  } else {
    props.httpServer = { enabled: true };
  }

  // fail safe - we don't have HMR for server
  // for production it should be disabled too
  if (iServer || isProduction) {
    props.hmrServer.enabled = false;
  }

  props.httpServer.port = props.httpServer.port ? props.httpServer.port : 4444;
  props.httpServer.fallback = props.httpServer.fallback
    ? props.httpServer.fallback
    : path.join(ctx.writer.outputDirectory, 'index.html');
  props.hmrServer.port = props.hmrServer.port ? props.hmrServer.port : props.httpServer.port;

  if (!props.httpServer.root) {
    props.httpServer.root = ctx.writer.outputDirectory;
  }
  return props;
}
