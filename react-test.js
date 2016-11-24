const build = require("./build/commonjs/index.js");
//global.Promise = require('bluebird')
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = new FuseBox({
    cache: false,
    homeDir: "test/fixtures/cases/react-demo",
    sourceMap: {
        bundleReference: "./sourcemaps.js.map",
        outFile: "sourcemaps.js.map",
    },
    outFile: "./out.js",
    plugins: [build.SVGPlugin, new build.CSSPlugin(), new build.BabelPlugin({
        test: /\.jsx$/,
        config: {
            sourceMaps: true,
            presets: ["es2015"],
            plugins: [
                ["transform-react-jsx"]
            ],
        }
    })]
});

fuseBox.bundle(">index.jsx +react-dom");