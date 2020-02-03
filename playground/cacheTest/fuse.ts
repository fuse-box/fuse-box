import * as path from 'path';
import { fusebox } from '../../src';
const fuse = fusebox({
  cache: { enabled: true, root: './.cache', strategy: 'fs' },
  dependencies: { include: ['ext_1'] },
  devServer: true,
  entry: 'src/index.js',
  modules: ['modules', path.join(__dirname, 'node_modules')],
  target: 'browser',
  webIndex: {
    template: 'src/index.html',
  },
});

fuse.runDev({
  bundles: {
    app: 'app.js',
    distRoot: path.join(__dirname, 'dist'),
  },
});
