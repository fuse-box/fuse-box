import { fusebox } from '../../src/core/fusebox';

const fuse = fusebox({
  target: 'browser',
  entry: 'src/index.js',
  modules: ['modules'],
  logging: {
    level: 'succinct',
  },
  webIndex: {
    template: 'src/index.html',
  },

  devServer: true,
  watch: true,
  cache: false,
});

// if (process.argv[2] === 'dev') {
//fuse.runDev();
// } else {
fuse.runProd();
//}
