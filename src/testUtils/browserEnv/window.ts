import { ITestWorkspace } from '../integrationTest';
import { createDocument } from './document';

export interface IMockedWindowProps {
  extendGlobal?: Record<string, any>;
  onConsoleError?: (args) => void;
  onConsoleLog?: (args) => void;
  onConsoleWarn?: (args) => void;
}

export function evalJavascript(scope, contents) {}

export class MockedWindow {
  constructor(public workspace: ITestWorkspace, public props: IMockedWindowProps) {
    if (this.props.extendGlobal) {
      for (const key in this.props.extendGlobal) {
        this[key] = this.props.extendGlobal[key];
      }
    }
  }

  $createdDOMElements = [];
  $loadedCSSFiles = [];

  $eval = (contents: string) => {
    var fn = new Function('GLOBAL_OBJECT', 'with (GLOBAL_OBJECT) { \n' + contents + '\n}');
    fn = fn.bind(this, this.$scope);
    fn(contents);
  };

  Array = Array;

  $scope = new Proxy(this, {
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

  Error = class {
    constructor(public message: string) {}
  };

  document = createDocument(this);

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

  window = {};

  entry = () => this.window['__fuse'].r(1);
}

export function createMockedWindow(workspace: ITestWorkspace, props: IMockedWindowProps): MockedWindow {
  return new MockedWindow(workspace, props);
}
