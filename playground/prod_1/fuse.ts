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
  sourceMap: true,

  devServer: true,
  watch: true,
  cache: false,
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
