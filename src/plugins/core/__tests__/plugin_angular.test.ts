import { EnvironmentType } from '../../../config/EnvironmentType';
import {
  EnvironmentTypesTestable,
  createTestWorkspace,
  testBrowser,
  ITestWorkspace,
} from '../../../testUtils/integrationTest';
import { pluginAngular } from '../plugin_angular';
import { pluginCSS } from '../plugin_css';

describe('Cache intergation test', () => {
  describe('Initial replacement', () => {
    function initWorkspace() {
      return createTestWorkspace({
        files: {
          'app.component.css': 'body { color: red }',
          'app.component.html': '<div></div>',
          'index.ts': `
             export function hello(){
              return {
                styleUrls: ['./app.component.css'],
                templateUrl: './app.component.html'
              }
             }
          `,
        },
      });
    }

    for (const env of EnvironmentTypesTestable) {
      it(`should work correctly ${EnvironmentType[env]}`, async () => {
        const response = await testBrowser({
          workspace: initWorkspace(),
          type: env,
          config: {
            plugins: [pluginCSS({ asText: true }), pluginAngular('*')],
          },
        });
        const window = await response.eval({});
        const index = window.entry();
        expect(index.hello()).toEqual({ styles: ['body { color: red }'], template: '<div></div>' });
      });
    }
  });

  describe('Cache validation', () => {
    let workspace: ITestWorkspace;
    function initWorkspace() {
      return createTestWorkspace({
        files: {
          'app.component.css': 'body { color: red }',
          'app.component.html': '<div></div>',
          'index.ts': `
             export function hello(){
              return {
                styleUrls: ['./app.component.css'],
                templateUrl: './app.component.html'
              }
             }
          `,
        },
      });
    }

    it(`should bundle initially correctly`, async () => {
      workspace = initWorkspace();
      const response = await testBrowser({
        workspace,
        type: EnvironmentType.DEVELOPMENT,
        config: {
          cache: true,
          plugins: [pluginCSS({ asText: true }), pluginAngular('*')],
        },
      });
      const window = await response.eval({});
      const index = window.entry();
      expect(index.hello()).toEqual({ styles: ['body { color: red }'], template: '<div></div>' });
    });

    it(`After modifying "component css" the entry point should be flushed too`, async () => {
      workspace.setFile('app.component.css', 'body { color: blue }');
      const response = await testBrowser({
        workspace,
        type: EnvironmentType.DEVELOPMENT,
        config: {
          plugins: [pluginCSS({ asText: true }), pluginAngular('*')],
        },
      });
      const window = await response.eval({});
      const index = window.entry();
      expect(index.hello()).toEqual({ styles: ['body { color: blue }'], template: '<div></div>' });
    });

    it(`After modifying "component html" the entry point should be flushed too`, async () => {
      workspace.setFile('app.component.html', '<h1></h1>');
      const response = await testBrowser({
        workspace,
        type: EnvironmentType.DEVELOPMENT,
        config: {
          plugins: [pluginCSS({ asText: true }), pluginAngular('*')],
        },
      });
      const window = await response.eval({});
      const index = window.entry();
      expect(index.hello()).toEqual({ styles: ['body { color: blue }'], template: '<h1></h1>' });
    });
  });
});
