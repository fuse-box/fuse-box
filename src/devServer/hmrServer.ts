import { Server } from 'ws';
import { Context } from '../core/context';
import { IHMRServerProps } from './devServerProps';
export interface ISocketClientInterface {
  getClient(): WebSocket;
  onMessage?: (fn: (name: string, payload) => void) => void;
  sendEvent(name: string, payload?, ws_instance?: WebSocket);
}
// keep that in mind:
// https://github.com/elsassph/react-hmr-ts/tree/master/examples/fuse-box

export function createClient(client): ISocketClientInterface {
  return {
    getClient() {
      return client;
    },
    sendEvent(name: string, payload?) {
      client.send(JSON.stringify({ name, payload }));
    },
  };
}
export type HMRServerMethods = ISocketClientInterface & {};
export interface ICreateHMRServerProps {
  ctx: Context;
  internalServer?: any;
  opts: IHMRServerProps;
}

export function createHMRServer(props: ICreateHMRServerProps): HMRServerMethods {
  const serverOpts: any = {};
  const ctx = props.ctx;
  if (props.internalServer) {
    serverOpts.server = props.internalServer;
  } else {
    serverOpts.port = props.opts.port;
  }
  const wss = new Server(serverOpts);
  const clients = new Set<ISocketClientInterface>();
  const scope = {
    listeners: [],
  };
  ctx.log.info('development', 'HMR server is running on port $port', { port: props.opts.port });
  wss.on('connection', function connection(ws) {
    const client = createClient(ws);
    clients.add(client);
    ws.on('close', () => {
      clients.delete(client);
    });
    ws.on('message', function incoming(data) {
      const json = JSON.parse(data);
      scope.listeners.forEach(fn => {
        fn(json.name, json.payload, this);
      });
    });
  });

  return {
    getClient: () => {
      return null;
    },
    onMessage: (fn: (name: string, payload, ws_instance?: WebSocket) => void) => {
      scope.listeners.push(fn);
    },
    sendEvent: (name: string, payload?, ws_instance?: WebSocket) => {
      if (ws_instance) {
        // if ws_instance then just respond to it
        clients.forEach(client => {
          if (client.getClient() === ws_instance) {
            client.sendEvent(name, payload, ws_instance);
          }
        });
      } else {
        clients.forEach(client => client.sendEvent(name, payload, ws_instance));
      }
    },
  };
}
