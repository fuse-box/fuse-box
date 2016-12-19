const build = require("./../build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = FuseBox.init({
    homeDir: "_playground/ts",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: true,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "_playground/_build/out.js",
    //package: "myLib",
    //globals: { myLib: "myLib" },
    modulesFolder: "_playground/npm",
    //plugins: [new build.TypeScriptHelpers(), build.JSONPlugin, new build.CSSPlugin({ minify: true })]
    plugins: [
        build.TypeScriptHelpers(),
        build.CSSPlugin({
            minify: true
                // serve: path => `./${path}`
        })
    ]
});

fuseBox.bundle(">index.ts");