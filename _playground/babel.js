const fsbx = require("./../build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = fsbx.FuseBox;
const fs = require("fs");
//npm install babel-core babel-preset-latest
let fuseBox = FuseBox.init({
    homeDir: "_playground/babel",
    cache: false,
    outFile: "_playground/_build/out.js",
    sourceMaps: {
        bundleReference: "out.js.map",
        outFile: "_playground/_build/out.js.map",
    },

    plugins: [
        fsbx.BabelPlugin({
            config: {
                sourceMaps: true,
                presets: ["es2015"]
            }
        })
    ]
});

fuseBox.bundle(">index.js");