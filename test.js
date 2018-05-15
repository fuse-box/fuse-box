const path = require('path');
process.env.FUSEBOX_DIST_ROOT = __dirname;
process.env.FUSEBOX_VERSION = '2.4.0';
process.env.PROJECT_NODE_MODULES = path.join(__dirname, 'node_modules');
process.env.SPARKY_LOG = false;
process.env.LOGGING = false;
process.env.DYNAMIC_IMPORTS_DISABLED = true;
const {FuseBox} = require('./bin/fusebox');

let file = process.argv[2];
let special = file && file.match(/^--file=(.*)/);
let mask = '*.test.ts';
if (special) {
    mask = special = special[1];
}
const fuse = FuseBox.init({
    homeDir: "src",
    target : "server@esnext",
    log : false,
    dynamicImportsEnabled : false,
    output: ".fusebox/$name.js",
    cache: false
});
fuse.bundle("fusebox").test(`[**/${mask}]`);