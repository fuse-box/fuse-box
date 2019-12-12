import { createRealNodeModule } from '../../utils/test_utils';

let _alreadySetup = false;
export function assertResolverModulesSetup() {
  if (_alreadySetup) { return; }
  _alreadySetup = true;

  createRealNodeModule(
    'resolver-test_a',
    {
      main: 'index.js',
      version: '1.0.1',
      browser: 'something-for-browser.js',
    },
    {
      'index.js': 'module.exports = {}',
      'foobar.js': 'module.exports = {}',
      'components/MyComponent.jsx': '',
      'sub/package.json': JSON.stringify({
        main: 'subindex.js',
      }),
      'something-for-browser.js': '',
      'sub/subindex.js': '',
    },
  );

  createRealNodeModule(
    'resolver-test_b',
    {
      main: 'index.js',
      version: '1.0.1',
      browser: { './foobar.js': './sub/subindex.js', oops: false },
    },
    {
      'index.js': 'module.exports = {}',
      'foobar.js': 'module.exports = {}',
      'deepa/index.js': `require('../foobar')`,
      'components/MyComponent.jsx': '',
      'sub/package.json': JSON.stringify({
        main: 'subindex.js',
      }),
      'something-for-browser.js': '',
      'sub/subindex.js': '',
    },
  );

  createRealNodeModule(
    'resolver-test_cc',
    {
      main: 'index.js',
      version: '1.0.1',
      browser: { './index.js': './browser-index.js' },
    },
    {
      'index.js': 'module.exports = { main : true }',
      'browser-index.js': 'module.exports = { browser : true }',
    },
  );

}


