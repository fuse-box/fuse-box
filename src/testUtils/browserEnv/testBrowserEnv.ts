import { IRunResponse } from '../../core/IRunResponse';
import { ITestWorkspace } from '../integrationTest';
import { MockedWindow, createMockedWindow, IMockedWindowProps } from './window';

export interface ITestBrowserResponse {
  __fuse?: any;
  runResponse?: IRunResponse;
  eval: (props?: IMockedWindowProps) => MockedWindow;
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
