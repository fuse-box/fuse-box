import * as path from 'path';
import { fusebox } from '../../../src';
const fuse = fusebox({
  cache: true,
  dependencies: { include: ['ext_1'] },
  devServer: true,
  entry: '../src/index.js',
  hmr: { plugin: '../src/hmr.ts' },
  modules: ['../modules', path.join(__dirname, '../node_modules')],
  target: 'browser',
  watcher: { include: ['../modules'] },
  webIndex: {
    template: '../src/index.html',
  },
});

fuse.runDev({
  bundles: {
    app: 'app.js',
    distRoot: path.join(__dirname, 'dist'),
  },
});
