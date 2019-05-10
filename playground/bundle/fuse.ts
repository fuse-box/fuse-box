import * as path from 'path';
import { fusebox } from '../../src/core/fusebox';
import { pluginJSON } from '../../src/plugins/core/plugin_json';

const fuse = fusebox({
  target: 'browser',
  logging: {
    level: 'succinct',
  },
  watch: true,
  devServer: {
    httpServer: {
      port: 9999,
    },
  },
  sourceMap: { vendor: false },

  env: { NODE_ENV: 'stage', foo: 'bar' },
  stylesheet: {
    breakDepednantsCache: true,
    macros: {
      $root: __dirname,
    },
  },
  cache: true,
  // {
  //   enabled: true,
  //   root: path.join(__dirname, '.cache'),
  // },
  webIndex: {
    publicPath: '.',
  },
  //production: {},
  homeDir: path.join(__dirname, 'src'),
  entry: 'index.ts',

  plugins: [pluginJSON('configs/.*', { useDefault: true })],
});

fuse.runDev();
