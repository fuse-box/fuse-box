import { fusebox } from '../../src/core/fusebox';

const fuse = fusebox({
  target: 'server',
  entry: 'src/index.ts',
  dependencies: {
    ignoreAllExternal: false,
  },
  watch: true,
  cache: false,
});

fuse.runDev();
