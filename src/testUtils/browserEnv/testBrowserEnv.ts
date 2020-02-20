import { IRunResponse } from '../../core/IRunResponse';
import { ITestWorkspace } from '../integrationTest';
import { MockedWindow, createMockedWindow, IMockedWindowProps } from './window';

export interface IBrowserEvalProps {
  onConsoleError?: (args: Array<any>) => void;
  onConsoleLog?: (args: Array<any>) => void;
  onConsoleWarn?: (args: Array<any>) => void;
}

export interface ITestBrowserResponse {
  __fuse?: any;
  runResponse?: IRunResponse;
  eval: (props?: IBrowserEvalProps) => MockedWindow;
}

export function createTestBrowserEnv(workspace: ITestWorkspace, runResponse: IRunResponse) {
  let contents = '\n';
  for (const bundle of runResponse.bundles) {
    if (bundle.bundle.webIndexed && !bundle.bundle.isCSSType) {
      contents += bundle.bundle.contents + '\n';
    }
  }
  contents + '\n';

  return {
    runResponse,
    eval: (props: IMockedWindowProps): MockedWindow => {
      props = props || {};
      const window = createMockedWindow(workspace, props);
      window.$eval(contents);
      return window;
    },
  };
}
