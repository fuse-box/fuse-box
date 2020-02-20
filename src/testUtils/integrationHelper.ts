import { EnvironmentType } from '../config/EnvironmentType';
import { IPublicConfig } from '../config/IConfig';
import { ITestBrowserResponse } from './browserEnv/testBrowserEnv';
import { createTestWorkspace, testBrowser, testServer, ITestWorkspace } from './integrationTest';
import { ITestServerResponse } from './serverEnv/testServerEnv';

export const runBrowserTest = async (props: {
  config?: IPublicConfig;
  env: EnvironmentType;
  files: Record<string, string>;
  modules?: Record<string, Record<string, string>>;
}): Promise<{ response: ITestBrowserResponse; workspace: ITestWorkspace }> => {
  const workspace = createTestWorkspace({ files: props.files, modules: props.modules });

  const b = await testBrowser({ config: props.config || {}, type: props.env, workspace: workspace });
  return { response: b, workspace };
};

export const runServerTest = async (props: {
  config?: IPublicConfig;
  env: EnvironmentType;
  files: Record<string, string>;
  modules?: Record<string, Record<string, string>>;
}): Promise<{ response: ITestServerResponse; workspace: ITestWorkspace }> => {
  const workspace = createTestWorkspace({ files: props.files, modules: props.modules });

  const b = await testServer({ config: props.config || {}, type: props.env, workspace: workspace });
  return { response: b, workspace };
};
