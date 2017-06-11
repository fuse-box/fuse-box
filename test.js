const fuse = require('./bin');
const path = require('path');

// A stable version of fusebox suitable for testing
//const FuseBox = fuse.e("FuseBox4Test");
process.env.FUSEBOX_DIST_ROOT = __dirname;
process.env.FUSEBOX_VERSION = '1.3.122';
process.env.PROJECT_NODE_MODULES = path.join(__dirname, 'node_modules');
process.env.SPARKY_LOG = false;
process.env.LOGGING = false;
const { FuseBox } = fuse.FuseBox.import('fuse-box4-test/FuseBox');


let file = process.argv[2];
let special = file && file.match(/^--file=(.*)/);
let mask = '*.test.ts';
if (special) {
    mask = special = special[1];
}

FuseBox.init({
    homeDir: `${__dirname}/src`,
    tsConfig: `${__dirname}/src/tsconfig.json`,
    outFile: `${__dirname}/.fusebox/test.js`,
    log: false,
    cache: false,
}).test(`[**/${mask}]`);
