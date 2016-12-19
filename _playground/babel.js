const fsbx = require("./../build/commonjs/index.js");
const watch = require("watch");

//global.Promise = require('bluebird')
const FuseBox = fsbx.FuseBox;
const fs = require("fs");
//npm install babel-core babel-preset-latest
let fuseBox = FuseBox.init({
    homeDir: "_playground/babel",
    cache: true,
    outFile: "_playground/_build/out.js",


    plugins: [
        fsbx.SVGPlugin(),
        fsbx.CSSPlugin(),
        fsbx.BabelPlugin({
            config: {
                sourceMaps: true,
                presets: ["latest", "stage-0"],
                // plugins: [
                //     ["transform-react-jsx"]
                // ]
            }
        })
    ]
});

fuseBox.bundle(">index.js", true);