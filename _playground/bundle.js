const fs = require("fs");
const watch = require("watch");
const precss = require("precss");
const build = require("./../build/commonjs/index.js");
const FuseBox = build.FuseBox;
const POST_CSS_PLUGINS = [precss()];

const fuseBox = FuseBox.init({
    extensions: ['.less'],
    homeDir: "_playground/ts",
    // sourceMap: {
    //     bundleReference: "./sourcemaps.js.map",
    //     outFile: "sourcemaps.js.map",
    // },
    cache: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "_playground/_build/out.js",
    //package: "myLib",
    //globals: { myLib: "myLib" },
    modulesFolder: "_playground/npm",
    plugins: [
        build.TypeScriptHelpers(),
        build.JSONPlugin(),
        build.ChainPlugin(/.less$/, [build.LESSPlugin(), build.CSSPlugin()]),
        build.ChainPlugin(/.css$/, [build.PostCSSPlugin(POST_CSS_PLUGINS), build.CSSPlugin({
            minify: true,
            serve: path => `./${path}`
        })])
    ]
});

fuseBox.bundle(">index.ts");