const fsbx = require("./../dist/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = fsbx.FuseBox;
const fs = require("fs");
//npm install babel-core babel-preset-latest
let fuseBox = FuseBox.init({
    homeDir: "_playground/vue",
    cache: false,
    outFile: "_playground/_build/out.js",


    plugins: [
        fsbx.TypeScriptHelpers(),
        fsbx.VuePlugin()
    ]
});

fuseBox.devServer(">index.ts");