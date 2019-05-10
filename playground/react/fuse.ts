import { fusebox } from '../../src/index';

const fuse = fusebox({
  cache: false,
  target: 'browser',
  entry: 'src/index.jsx',
  webIndex: {
    template: 'src/index.html',
  },
  watch: true,
  hmr: true,
  devServer: true,
  logging: { level: 'verbose' },
});
fuse.runDev();
