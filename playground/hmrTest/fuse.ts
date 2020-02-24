import * as path from 'path';
import { fusebox } from '../../src/index';
const fuse = fusebox({
  cache: { enabled: true, root: './.cache' },
  devServer: true,
  entry: 'src/index.ts',
  hmr: { plugin: 'src/hmr.ts' },
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
