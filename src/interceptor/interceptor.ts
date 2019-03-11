import { InterceptorEvents } from './events';

interface TypedInterceptor<T> {
  on<K extends keyof T>(s: K, props: (props: T[K]) => T[K]);
  sync<K extends keyof T>(s: K, props: T[K]): T[K];
}
export type MainInterceptor = TypedInterceptor<InterceptorEvents>;
export function createInterceptor(): MainInterceptor {
  const subscriptions = new Map<string, Array<(props: any) => any>>();
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
  return {
    on: function(key: any, fn: (props: any) => any) {
      add(key, fn);
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
  };
}
