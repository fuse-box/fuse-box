import { fusebox } from '../../src/core/fusebox';
import { pluginJSON } from '../../src/plugins/core/plugin_json';
import { pluginReplace } from '../../src/plugins/core/plugin_replace';

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
  //modules: ['./oi'],
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
    template: 'src/index.html',
  },
  //production: {},
  homeDir: __dirname,
  entry: 'src/index.ts',

  plugins: [pluginJSON('configs/.*', { useDefault: true }), pluginReplace('other/Other.ts', { $version: '1.1.0' })],
});

fuse.runDev();
