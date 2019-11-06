import * as path from 'path';
import { fusebox } from '../../src/core/fusebox';
const fuse = fusebox({
  target: 'browser',
  logging: {
    level: 'succinct',
  },

  stylesheet: {
    macros: {
      $root: __dirname,
    },
  },
  sourceMap: true,
  modules: ['modules/'],
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
  webIndex: {
    publicPath: '.',
    template: 'src/index.html',
  },
  devServer: true,
  //production: {},
  homeDir: __dirname,
  entry: 'src/index.ts',

  //plugins: [pluginJSON('configs/.*', { useDefault: true }), pluginReplace('other/Other.ts', { $version: '1.1.0' })],
});

fuse.runDev();
