import { fusebox } from '../../src/core/fusebox';

const fuse = fusebox({
  entry: 'src/index.js',
  logging: {
    level: 'succinct',
  },
  modules: ['modules'],
  sourceMap: true,
  target: 'browser',
  webIndex: {
    template: 'src/index.html',
  },

  cache: false,
  devServer: true,
  watch: true,
});

const isProd = process.argv.indexOf('--prod') > -1;
if (isProd) {
  fuse.runProd({
    screwIE: true,
  });
} else {
  fuse.runDev();
}
// if (process.argv[2] === 'dev') {
// } else {
