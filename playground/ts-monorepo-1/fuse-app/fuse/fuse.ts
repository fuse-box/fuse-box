import { fusebox } from '../../../../src';

import { join } from 'path';
import { runUpdateSimulation } from './simulate';

const workspaceRoot = join(__dirname, '../..');
console.log('Workspace Root:', workspaceRoot);

// set AUTOMOD to true to automatically update some files to trigger the watcher
runUpdateSimulation(!!process.env.AUTOMOD);

const fuse = fusebox({
  compilerOptions: {
    tsConfig: '../tsconfig.json',
  },
  devServer: true,
  entry: '../src/index.ts',
  target: 'browser',
  watcher: {
    root: [workspaceRoot],
  },
  webIndex: { template: '../src/index.html' },
});

fuse.runDev();
