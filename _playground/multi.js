const fs = require("fs");
const watch = require("watch");
const precss = require("precss");
const build = require("./../build/commonjs/index.js");
const FuseBox = build.FuseBox;
const POST_CSS_PLUGINS = [precss()];

const fuseBox = FuseBox.init({
    homeDir: "_playground/multi",
});

fuseBox.bundle({
    "_build/test_vendor.js": "+path",
    "_build/app.js": ">[index.ts]"
})

/*const devServer = fuseBox.devServer(">index.ts", {
    port: 8083,
    emitter: (self, fileInfo) => {
        self.socketServer.send("source-changed", fileInfo);
    }
});*/
// fuseBox.devServer(">index.ts", {
//     port: 7777
// })

// fuseBox.devServer(">index.ts", {
//     port: 7778
// })