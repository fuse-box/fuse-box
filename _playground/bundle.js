const fs = require("fs");
const watch = require("watch");
const precss = require("precss");
const build = require("./../build/commonjs/index.js");
const FuseBox = build.FuseBox;
const POST_CSS_PLUGINS = [precss()];

const fuseBox = FuseBox.init({
    homeDir: "_playground/ts",
    sourceMap: {
        bundleReference: "./sourcemaps.js.map",
        outFile: "_playground/_build/sourcemaps.js.map",
    },
    //globals: { jQuery: "$" },
    cache: true,
    log: false,
    //globals: { default: "myLib", "wires-reactive": "Reactive" },
    outFile: "_playground/_build/out.js",
    //package: "myLib",
    //globals: { myLib: "myLib" },
    modulesFolder: "_playground/npm",
    plugins: [
        build.TypeScriptHelpers(),
        build.JSONPlugin(),
        build.EnvPlugin({ foo: "bar" }),

        [/\.txt$/, build.ConcatPlugin({ ext: ".txt", name: "textBundle.txt" })],

        // process them all ;-)
        [build.LESSPlugin(), build.CSSPlugin()],

        [build.SassPlugin(), build.CSSPlugin()],

        // All other CSS files
        [build.PostCSS(POST_CSS_PLUGINS), build.CSSPlugin()],

        // Add a banner to bundle output
        build.BannerPlugin('// Hey this is my banner! Copyright 2016!')

        //build.UglifyJSPlugin()
    ]
});

fuseBox.devServer(">index.ts", { port: 8083 });