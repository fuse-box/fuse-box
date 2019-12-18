import * as path from 'path';
import { fusebox } from '../../src/core/fusebox';
const fuse = fusebox({
  logging: {
    level: 'succinct',
  },
  target: 'browser',

  cache: {
    FTL: false,
    enabled: false,
    root: path.join(__dirname, '.cache'),
  },
  dependencies: {
    include: [
      // 'tslib',
      // '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js',
      // '@webcomponents/webcomponentsjs/webcomponents-bundle.js',
    ],
  },
  devServer: true,
  entry: 'src/index.ts',
  //production: {},
  homeDir: __dirname,
  modules: ['modules/'],
  sourceMap: true,
  stylesheet: {
    macros: {
      $root: __dirname,
    },
  },
  webIndex: {
    publicPath: '.',
    template: 'src/index.html',
  },

  //plugins: [pluginJSON('configs/.*', { useDefault: true }), pluginReplace('other/Other.ts', { $version: '1.1.0' })],
});

fuse.runDev();
