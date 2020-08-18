import * as path from 'path';
import { fusebox, pluginAngular, pluginSass } from '../../src';
const fuse = fusebox({
  cache: { enabled: true, root: './.cache', strategy: 'fs' },
  dependencies: { include: ['ext_1'] },
  devServer: true,
  entry: 'src/angular/app.component.ts',

  plugins: [pluginAngular('*.component.ts'), pluginSass({ asText: true, useDefault: false })],

  hmr: { plugin: 'src/hmr.ts' },
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
