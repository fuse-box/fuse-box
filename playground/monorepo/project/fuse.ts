import { fusebox } from '../../../src/core/fusebox';

const fuse = fusebox({
  cache: true,
  compilerOptions: { tsConfig: 'tsconfig.json' },
  devServer: true,
  entry: 'src/index.ts',
  target: 'browser',
  webIndex: {
    template: 'src/index.html',
  },
});

fuse.runDev({ bundles: { distRoot: 'dist' } });
