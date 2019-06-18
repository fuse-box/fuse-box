import { fusebox } from '../../src/core/fusebox';
import { pluginSass } from '../../src';
import * as path from 'path';
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
  webIndex: {
    template: 'src/index.html',
  },
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
  watch: true,
  cache: false,
});

console.log(process.argv);
const isProd = process.argv.indexOf('--prod') > -1;
if (isProd) {
  console.log('run prod');
  fuse.runProd({
    target: 'ES5',
    screwIE: true,
    uglify: true,
  });
} else {
  fuse.runDev();
}
// if (process.argv[2] === 'dev') {
// } else {
