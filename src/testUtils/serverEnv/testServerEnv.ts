import { IRunResponse } from '../../core/IRunResponse';

export interface ITestServerResponse {
  __fuse?: any;
  runResponse?: IRunResponse;

  eval: (props: { onConsoleLog?: (args: Array<any>) => void; onServerRequire?: (args: Array<any>) => void }) => void;
}

export function createTestServerEnv(runResponse: IRunResponse) {
  return (): ITestServerResponse => {
    let contents = '\n';
    for (const bundle of runResponse.bundles) {
      contents += bundle.bundle.contents + '\n';
    }
    contents + '\n';

    return {
      runResponse,
      eval: props => {
        const serverScope = {
          console: {
            log: (...args) => {
              if (props.onConsoleLog) props.onConsoleLog(args);
            },
          },
          global: {},
          require: (...args) => {
            if (props.onServerRequire) return props.onServerRequire(args);
          },
        };

        const globalObject = new Proxy(serverScope, {
          get(obj, key) {
            if (typeof key !== 'symbol') {
              if (key === '__fuse') return obj.global['__fuse'];
              return obj[key];
            }
          },
          has() {
            return true;
          },
          set: function(obj, prop, value) {
            obj[prop] = value;
            return true;
          },
        });
        var fn = new Function('GLOBAL_OBJECT', 'with (GLOBAL_OBJECT) { ' + contents + '}');
        fn = fn.bind(globalObject, globalObject);
        fn(contents);
      },
    };
  };
}
