import * as path from 'path';
import { fusebox } from '../../src';
const fuse = fusebox({
  cache: { enabled: true, root: './.cache' },
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
    root: path.join(__dirname, 'dist'),
  },
});
