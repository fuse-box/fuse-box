const build = require("../dist/commonjs/index.js");
const watch = require("watch");

const FuseBox = build.FuseBox;
const fs = require("fs");

const UglifyJSPlugin = require('../dist/commonjs/plugins/UglifyJSPlugin').UglifyJSPlugin;

let fuseBox = FuseBox.init({
    homeDir: "_playground/uglify",
    sourceMap: {
        bundleReference: "./sourcemaps.js.map",
        outFile: "_playground/uglify/_dist/sourcemaps.js.map",
    },
    globals: { default: "mySuperLib" },
    cache: false,
    outFile: "_playground/uglify/_dist/dist.js",
    plugins: [
        UglifyJSPlugin()
    ]
});

fuseBox.bundle(">index.js");