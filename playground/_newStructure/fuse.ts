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
  webIndex: {
    publicPath: '.',
    template: 'src/index.html',
  },
  devServer: true,

  homeDir: __dirname,
  entry: 'src/index.ts',
});

fuse.runDev({
  bundles: {
    root: path.join(__dirname, 'dist'),
    app: 'app.js',
  },
});
