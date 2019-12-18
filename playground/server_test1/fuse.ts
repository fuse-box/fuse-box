import { fusebox } from '../../src/core/fusebox';

const fuse = fusebox({
  cache: false,
  dependencies: {
    ignoreAllExternal: false,
  },
  entry: 'src/index.ts',
  target: 'server',
  watch: true,
});

fuse.runDev();
