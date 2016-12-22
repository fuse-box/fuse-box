const fsbx = require("./../build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = fsbx.FuseBox;
const fs = require("fs");
//npm install babel-core babel-preset-latest
let fuseBox = FuseBox.init({
    homeDir: "_playground/ts",
    cache: false,
    outFile: "_playground/_build/out.js",


    plugins: [
        fsbx.TypeScriptHelpers()
    ]
});

fuseBox.bundle(">react.tsx +react-dom", false);