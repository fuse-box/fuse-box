import { InterceptorEvents } from './events';

interface TypedInterceptor<T> {
  getPromises: () => Array<any>;
  promise: (fn: () => Promise<any>) => void;
  resolve: () => Promise<any>;
  on<K extends keyof T>(key: K, fn: (props: T[K]) => T[K]);
  sync<K extends keyof T>(key: K, props: T[K]): T[K];
  awaitForSync<K extends keyof T>(key: K, props: T[K]): Promise<T[K]>;
  awaitOn<K extends keyof T>(key: K, fn: (props: T[K]) => Promise<T[K]>);
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
    getPromises: () => promises,
    promise: function(fn: () => Promise<any>) {
      promises.push(fn);
    },
    resolve: async function(): Promise<any> {
      const res = await Promise.all(promises.map(p => p()));
      promises = [];
      return res;
    },
    on,
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
    awaitOn: on,
    awaitForSync: async function(key: string, props: any) {
      if (subscriptions.has(key)) {
        const fns = subscriptions.get(key);
        const responses = [];

        for (let i = 0; i < fns.length; i++) {
          responses.push(await fns[i](props));
        }

        if (responses.length > 0) {
          // return the latest response
          return responses[responses.length - 1];
        }
      }
      return props;
    },
  };
}
