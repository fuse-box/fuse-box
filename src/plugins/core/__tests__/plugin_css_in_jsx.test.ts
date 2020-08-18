import { EnvironmentType } from '../../../config/EnvironmentType';
import { EnvironmentTypesTestable, createTestWorkspace, testBrowser } from '../../../testUtils/integrationTest';
import { pluginCSSInJSX } from '../plugin_css_in_jsx';

describe('CSS in JSX intergation test', () => {
  describe('JSX factory', () => {
    function initWorkspace() {
      return createTestWorkspace({
        files: {
          'index.ts': `
            import { css } from '@emotion/core';
            import * as React from 'react';

            const styles1 = css({
              backgroundColor: 'hotpink'
            });
            const styles2 = css({
              color: 'white'
            });
            export const App = () => (
              <div css={[styles1, styles2]}>Super Duper Useful</div>
            );
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
            plugins: [
              pluginCSSInJSX({
                autoInject: true,
                autoLabel: true,
                cssPropOptimization: true,
                emotionCoreAlias: '@emotion/core',
                jsxFactory: 'jsx',
                labelFormat: '[dirname]--[local]',
                sourceMap: true,
                test: /src\/(.*?)\.(js|jsx|ts|tsx)$/,
              }),
            ],
          },
        });

        const window = await response.eval({});
        const index = window.entry();
        // @todo: Fix integration tests for react/this
        expect(index).toEqual({});
      });
    }
  });
});
