import { createContext } from '../../core/context';

let mock__ws = {
  connections: [],
  events: {},
  instances: [],
  params: {},
  sentData: [],
};
jest.mock('ws', () => {
  class SocketConnection {
    public events;
    constructor() {
      this.events = {};
    }
    on(type: string, fn) {
      this.events[type] = fn;
    }
    send(msg: string) {
      mock__ws.sentData.push(msg);
    }
  }
  return {
    Server: class Socket {
      constructor(params) {
        mock__ws.params = params;
        mock__ws.instances.push(this);
      }
      triggerConnection() {
        if (mock__ws.events['connection']) {
          const connection = new SocketConnection();
          mock__ws.connections.push(connection);
          mock__ws.events['connection'](connection);
        }
      }
      triggerClient(name, message) {
        mock__ws.connections.forEach(connection => {
          connection.events[name](message);
        });
      }

      on(eventType: string, fn) {
        mock__ws.events[eventType] = fn;
      }
    },
  };
});

import { createTestContext } from '../../utils/test_utils';
import { createHMRServer } from '../hmrServer';
describe('HMR server test', () => {
  beforeEach(() => {
    mock__ws = {
      connections: [],
      events: {},
      instances: [],
      params: {},
      sentData: [],
    };
  });
  it('should create and bind events', () => {
    const ctx = createTestContext();
    createHMRServer({ ctx, opts: { enabled: true } });
    expect(mock__ws.instances).toHaveLength(1);
    expect(mock__ws.events['connection']).toBeTruthy();
  });

  it('should create with internal server', () => {
    const ctx = createTestContext();
    const internalServer = { foo: 'server' };
    createHMRServer({ ctx, internalServer: internalServer, opts: { enabled: true } });
    expect(mock__ws.instances).toHaveLength(1);
    expect(mock__ws.params).toEqual({ server: { foo: 'server' } });
    expect(mock__ws.events['connection']).toBeTruthy();
  });

  it('should create with port', () => {
    const ctx = createTestContext();

    createHMRServer({ ctx, opts: { enabled: true, port: 2222 } });
    expect(mock__ws.instances).toHaveLength(1);
    expect(mock__ws.params).toEqual({ port: 2222 });
    expect(mock__ws.events['connection']).toBeTruthy();
  });

  it('should dispatch a message', () => {
    const ctx = createTestContext();
    const server = createHMRServer({ ctx, opts: { enabled: true } });
    const instance = mock__ws.instances[0];
    instance.triggerConnection();
    server.onMessage((name, payload) => {
      expect(name).toEqual('foo');
      expect(payload).toEqual({ bar: 1 });
    });
    instance.triggerClient('message', JSON.stringify({ name: 'foo', payload: { bar: 1 } }));
  });

  it('should send an a message', () => {
    const ctx = createTestContext();
    const server = createHMRServer({ ctx, opts: { enabled: true } });
    const instance = mock__ws.instances[0];
    instance.triggerConnection();

    const data = { name: 'some', payload: { hello: 'world' } };
    server.sendEvent(data.name, data.payload);

    expect(mock__ws.sentData).toEqual([JSON.stringify(data)]);
  });

  it('should close an connection', () => {
    const ctx = createTestContext();
    createHMRServer({ ctx, opts: { enabled: true } });
    const instance = mock__ws.instances[0];
    instance.triggerConnection();

    instance.triggerClient('close', {});
  });
});
