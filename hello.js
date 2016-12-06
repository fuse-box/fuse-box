const build = require("./build/commonjs/index.js");
//global.Promise = require('bluebird')
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "./out.js",

    //modulesFolder: "test/fixtures/modules",
    //plugins: [build.HTMLPlugin, build.JSONPlugin, new build.CSSPlugin({ minify: true })]
});

fuseBox.bundle(">index.js");