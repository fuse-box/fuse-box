import { InterceptorEvents } from './events';

interface TypedInterceptor<T> {
  getPromises: () => Array<any>;
  on<K extends keyof T>(key: K, fn: (props: T[K]) => any);
  promise: (fn: () => Promise<any>) => void;
  resolve: () => Promise<any>;
  send<K extends keyof T>(key: K, props: T[K]): Promise<T[K]>;
  sync<K extends keyof T>(key: K, props: T[K]): T[K];
  waitFor<K extends keyof T>(key: K, fn: (props: T[K]) => Promise<T[K]>);
}
export type MainInterceptor = TypedInterceptor<InterceptorEvents>;
export function createInterceptor(): MainInterceptor {
  const subscriptions = new Map<string, Array<(props: any) => any>>();
  let promises: Array<any> = [];
  // adds an interceptor
  function add(key: string, fn: any) {
    let fns: Array<any> = [];
    if (!subscriptions.has(key)) {
      subscriptions.set(key, fns);
    } else {
      fns = subscriptions.get(key);
    }
    fns.push(fn);
  }

  const on = function(key: any, fn: (props: any) => any) {
    add(key, fn);
  };

  return {
    on,
    promise: function(fn: () => Promise<any>) {
      promises.push(fn());
    },
    resolve: async function(): Promise<any> {
      const res = await Promise.all(promises);
      promises = [];
      return res;
    },
    send: async function(key: string, props: any) {
      if (subscriptions.has(key)) {
        const fns = subscriptions.get(key);
        const responses = [];

        for (let fn of fns) {
          responses.push(await fn(props));
        }

        if (responses.length > 0) {
          // return the latest response
          return responses[responses.length - 1];
        }
      }
      return props;
    },
    // sync (emit an even which should return an according props
    sync: function(key: string, props: any) {
      if (subscriptions.has(key)) {
        const fns = subscriptions.get(key);
        const responses = fns.map(fn => fn(props));
        if (responses.length > 0) {
          // return the latest response
          return responses[responses.length - 1];
        }
      }
      return props;
    },
    waitFor: on,
    getPromises: () => promises,
  };
}
