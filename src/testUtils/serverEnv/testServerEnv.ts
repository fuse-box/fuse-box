import { IRunResponse } from '../../core/IRunResponse';
import { ITestWorkspace } from '../integrationTest';
import { MockedServer, createMockedServer, IMockedServerProps } from './ServerTestEnv';

export interface ITestServerResponse {
  __fuse?: any;
  runResponse?: IRunResponse;

  eval: (props?: IMockedServerProps) => MockedServer;
}

export function createTestServerEnv(workspace: ITestWorkspace, runResponse: IRunResponse) {
  return (): ITestServerResponse => {
    let contents = '\n';
    for (const bundle of runResponse.bundles) {
      if (bundle.bundle.webIndexed) {
        contents += bundle.bundle.contents + '\n';
      }
    }
    contents + '\n';

    return {
      runResponse,
      eval: (props: IMockedServerProps): MockedServer => {
        const server = createMockedServer(workspace, props);
        server.$eval(contents);
        return server;
      },
    };
  };
}
