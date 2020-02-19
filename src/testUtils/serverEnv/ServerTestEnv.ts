export interface IMockedServerProps {
  onConsoleError?: (args) => void;

  onConsoleLog?: (args: Array<any>) => void;
  onConsoleWarn?: (args) => void;
  onServerRequire?: (args: Array<any>) => void;
}

export function evalJavascript(scope, contents) {}

export class MockedServer {
  constructor(public props: IMockedServerProps) {}

  $eval = (contents: string) => {
    var fn = new Function('GLOBAL_OBJECT', 'with (GLOBAL_OBJECT) { ' + contents + '}');
    fn = fn.bind(this, this.$scope);
    fn(contents);
  };

  $scope = new Proxy(this, {
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

  Error = class {
    constructor(public message: string) {}
  };

  Promise = Promise;

  console = {
    error: (...args) => {
      if (this.props.onConsoleError) this.props.onConsoleError(args);
    },
    log: (...args) => {
      if (this.props.onConsoleLog) this.props.onConsoleLog(args);
    },
    warn: (...args) => {
      if (this.props.onConsoleWarn) this.props.onConsoleError(args);
    },
  };

  global = {};

  require = (...args) => {
    if (this.props.onServerRequire) return this.props.onServerRequire(args);
  };

  get fuse(): any {
    return this.global['__fuse'];
  }

  entry = () => this.fuse.r(1);
}

export function createMockedServer(props?: IMockedServerProps): MockedServer {
  return new MockedServer(props || {});
}
