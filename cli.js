const fuse = require('./bin');
const path = require('path');

// A stable version of fusebox suitable for testing
//const FuseBox = fuse.e("FuseBox4Test");
process.env.FUSEBOX_DIST_ROOT = __dirname;
process.env.FUSEBOX_VERSION = '1.3.122';
process.env.PROJECT_NODE_MODULES = path.join(__dirname, 'node_modules');

const { FuseBox } = fuse.FuseBox.import('fuse-box4-test/FuseBox');


FuseBox.init({
    homeDir: `${__dirname}/src`,
    tsConfig: `${__dirname}/src/tsconfig.json`,
    outFile: `${__dirname}/bin/cli.dev.js`,
    log: true,
    cache: true,
}).bundle(` > [cli/CommandLine.ts ]`);