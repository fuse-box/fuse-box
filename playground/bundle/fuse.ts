import * as path from 'path';
import { createContext } from '../../src/core/Context';
import { bundleDev } from '../../src/main/bundle_dev';
import { pluginJSON } from '../../src/plugins/core/plugin_json';

const ctx = createContext({
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
  cache: false,
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

bundleDev(ctx).catch(e => {
  console.error(e);
});
