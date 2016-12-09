const build = require("./build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/ts",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "./out.js",

    //modulesFolder: "test/fixtures/modules",
    //plugins: [new build.TypeScriptHelpers(), build.JSONPlugin, new build.CSSPlugin({ minify: true })]
    plugins: [build.TypeScriptHelpers]
});


watch.watchTree(__dirname + '/test/fixtures/', function(f, curr, prev) {
    fuseBox.bundle(">index.ts");
})