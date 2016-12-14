const build = require("./../build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = FuseBox.init({
    homeDir: "_playground/myLib",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: false,

    outFile: "_playground/ts/foo.js",

    package: "myLib",
    globals: { myLib: "myLib" },
});

fuseBox.bundle(">index.ts");