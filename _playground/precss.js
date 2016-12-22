const build = require("../dist/commonjs/index.js");
const watch = require("watch");

const FuseBox = build.FuseBox;
const fs = require("fs");

const StylusPlugin = require('../dist/commonjs/plugins/StylusPlugin').StylusPlugin;
const LESSPlugin = require('../dist/commonjs/plugins/LESSPlugin').LESSPlugin;

let fuseBox = FuseBox.init({
    homeDir: "_playground/precss",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "_playground/precss/_dist/dist.js",
    //package: "myLib",
    //globals: { myLib: "myLib" },
    //plugins: [new build.TypeScriptHelpers(), build.JSONPlugin, new build.CSSPlugin({ minify: true })]
    plugins: [
        [/^style\d?\.styl$/, StylusPlugin({}), build.CSSPlugin({})],
        [LESSPlugin({}), build.CSSPlugin({})]
        // [/^style-dup\.styl$/, StylusPlugin({})]
    ]
});

fuseBox.bundle(">index.js");