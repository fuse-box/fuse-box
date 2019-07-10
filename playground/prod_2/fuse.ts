import * as path from 'path';
import { pluginSass, sparky } from '../../src';
import { fusebox } from '../../src/core/fusebox';

const { rm } = sparky(class {});
const fuse = fusebox({
  target: 'browser',
  entry: 'src/index.ts',
  modules: ['modules'],
  logging: {
    level: 'succinct',
  },
  dependencies: {
    include: ['tslib'],
  },
  webWorkers: {},
  webIndex: {
    template: 'src/index.html',
  },

  cache: { root: '.cache', enabled: false },
  resources: {
    resourcePublicRoot: '/test',
  },
  //stylesheet: { groupResourcesFilesByType: false },

  plugins: [
    pluginSass('text/*.scss', {
      stylesheet: {
        resourcePublicRoot: '/dump',
        resourceFolder: 'dump',
        groupResourcesFilesByType: false,
      },
      asText: true,
    }),
  ],
  sourceMap: true,

  devServer: true,
  watch: { ignored: ['worker/*'] },
});

const isProd = process.argv.indexOf('--prod') > -1;

rm(path.join(__dirname, 'dist'));
if (isProd) {
  fuse.runProd({
    target: 'ES5',
    screwIE: true,
    uglify: false,
  });
} else {
  fuse.runDev();
}
// if (process.argv[2] === 'dev') {
// } else {
