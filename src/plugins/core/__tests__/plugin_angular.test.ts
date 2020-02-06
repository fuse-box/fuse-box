import { EnvironmentType } from '../../../config/EnvironmentType';
import { createTestWorkspace, testBrowser, ITestWorkspace } from '../../../testUtils/integrationTest';
import { pluginAngular } from '../plugin_angular';

describe('Cache intergation test', () => {
  let workspace: ITestWorkspace;
  function initWorkspace() {
    return (workspace = createTestWorkspace({
      files: {
        'app.component.html': '<div></div>',
        'index.ts': `
           export function hello(){
            return {
              templateUrl: './app.component.html'
            }
           }
        `,
      },
    }));
  }

  it('should work correctly for production', async () => {
    initWorkspace();

    const response = await testBrowser({
      workspace,
      type: EnvironmentType.DEVELOPMENT,
      config: {
        plugins: [pluginAngular('*')],
      },
    });
    const window = await response.eval({});
    const index = window.entry();
    expect(index.hello()).toEqual({ template: '<div></div>' });
  });
});
