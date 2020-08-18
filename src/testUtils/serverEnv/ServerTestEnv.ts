import * as path from 'path';
import { readFile } from '../../utils/utils';
import { ITestWorkspace } from '../integrationTest';
export interface IMockedServerProps {
  onConsoleError?: (args) => void;

  onConsoleLog?: (args: Array<any>) => void;
  onConsoleWarn?: (args) => void;
  onServerRequire?: (args: Array<any>) => any;
}

export function evalJavascript(scope, contents) {}

export class MockedServer {
  constructor(public workspace: ITestWorkspace, public props: IMockedServerProps) {}

  $eval = (contents: string) => {
    var fn = new Function('GLOBAL_OBJECT', 'with (GLOBAL_OBJECT) { \n' + contents + '\n}');
    fn = fn.bind(this, this.$scope);
    fn(contents);
  };

  __dirname = this.workspace.distRoot;

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
    if (this.props.onServerRequire) {
      const userResponse = this.props.onServerRequire(args);
      if (userResponse) return userResponse;
    }
    if (args[0] === 'path') return path;
    if (path.isAbsolute(args[0])) return this.$eval(readFile(args[0]));
  };

  get fuse(): any {
    return this.global['__fuse'];
  }

  entry = () => this.fuse.r(1);
}

export function createMockedServer(workspace: ITestWorkspace, props?: IMockedServerProps): MockedServer {
  return new MockedServer(workspace, props || {});
}
