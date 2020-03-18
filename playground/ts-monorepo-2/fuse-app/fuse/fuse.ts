import { fusebox } from 'fuse-box';
import { join } from 'path';
import {runUpdateSimulation} from "./simulate";

const workspaceRoot = join(__dirname, "../..");
console.log("Workspace Root:", workspaceRoot);

// set AUTOMOD to true to automatically update some files to trigger the watcher
runUpdateSimulation(!!process.env.AUTOMOD);

const fuse = fusebox({
    target: 'browser',
    entry: '../src/index.ts',
    webIndex: { template: '../src/index.html' },
    watcher: {
        root: [
            workspaceRoot,
        ],
    },
    devServer: true,
    compilerOptions: {
        tsConfig: "../tsconfig.json"
    }
})

fuse.runDev();