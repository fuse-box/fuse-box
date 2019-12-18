import * as path from 'path';
import { pluginSass, sparky } from '../../src';
import { fusebox } from '../../src/core/fusebox';

const { rm } = sparky(class {});
const fuse = fusebox({
  dependencies: {
    include: ['tslib'],
  },
  entry: 'src/index.ts',
  logging: {
    level: 'succinct',
  },
  modules: ['modules'],
  target: 'browser',
  webIndex: {
    template: 'src/index.html',
  },
  webWorkers: {},

  cache: { enabled: false, root: '.cache' },
  resources: {
    resourcePublicRoot: '/test',
  },
  //stylesheet: { groupResourcesFilesByType: false },

  plugins: [
    pluginSass('text/*.scss', {
      asText: true,
      stylesheet: {
        groupResourcesFilesByType: false,
        resourceFolder: 'dump',
        resourcePublicRoot: '/dump',
      },
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
    screwIE: true,
    target: 'ES5',
    uglify: false,
  });
} else {
  fuse.runDev();
}
// if (process.argv[2] === 'dev') {
// } else {
