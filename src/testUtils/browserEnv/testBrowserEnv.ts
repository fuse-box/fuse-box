import { IRunResponse } from '../../core/IRunResponse';

export interface IBrowserEvalProps {
  onConsoleError?: (args: Array<any>) => void;
  onConsoleLog?: (args: Array<any>) => void;
  onConsoleWarn?: (args: Array<any>) => void;
}

export interface ITestWindow {
  window: any;
  entry: () => any;
}
export interface ITestBrowserResponse {
  __fuse?: any;
  runResponse?: IRunResponse;
  eval: (props?: IBrowserEvalProps) => ITestWindow;
}

export function createTestBrowserEnv(runResponse: IRunResponse) {
  let contents = '\n';
  for (const bundle of runResponse.bundles) {
    if (bundle.bundle.webIndexed) {
      contents += bundle.bundle.contents + '\n';
    }
  }
  contents + '\n';

  return {
    runResponse,
    eval: props => {
      props = props || {};
      const windowScope = {
        Error: class {
          constructor(public message: string) {}
        },
        Promise: Promise,
        console: {
          error: (...args) => {
            if (props.onConsoleError) props.onConsoleError(args);
          },
          log: (...args) => {
            if (props.onConsoleLog) props.onConsoleLog(args);
          },
          warn: (...args) => {
            if (props.onConsoleError) props.onConsoleError(args);
          },
        },
        window: {},
        entry: () => windowScope.window['__fuse'].r(1),
      };

      const globalObject = new Proxy(windowScope, {
        get(obj, key) {
          if (typeof key !== 'symbol') {
            if (key === '__fuse') return obj.window['__fuse'];
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

      return windowScope;
    },
  };
}
