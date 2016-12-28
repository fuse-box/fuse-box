const build = require("../dist/commonjs/index.js");
const watch = require("watch");

const FuseBox = build.FuseBox;
const fs = require("fs");

const StylusPlugin = require('../dist/commonjs/plugins/StylusPlugin').StylusPlugin;
const LESSPlugin = require('../dist/commonjs/plugins/LESSPlugin').LESSPlugin;
const RawPlugin = require('../dist/commonjs/plugins/RawPlugin').RawPlugin;
const SourceMapPlugin = require('../dist/commonjs/plugins/SourceMapPlugin').SourceMapPlugin;

let fuseBox = FuseBox.init({
    homeDir: "_playground/precss",
    sourceMap: {
        bundleReference: "dist.js.map",
        outFile: "_playground/precss/_dist/dist.js.map",
    },
    cache: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "_playground/precss/_dist/dist.js",
    //package: "myLib",
    //globals: { myLib: "myLib" },
    //plugins: [new build.TypeScriptHelpers(), build.JSONPlugin, new build.CSSPlugin({ minify: true })]
    plugins: [
        // [/style\d?\.styl$/, StylusPlugin({}), build.CSSPlugin({})],
        // [LESSPlugin({}), build.CSSPlugin({})],
        // [/\.raw$/, RawPlugin({extensions: ['.raw']})]
        // [/^style-dup\.styl$/, StylusPlugin({})]
        SourceMapPlugin()
    ]
});

fuseBox.bundle(">index.js");