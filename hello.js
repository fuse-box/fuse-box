const build = require("./build/commonjs/index.js");

const FuseBox = build.FuseBox;
const fs = require("fs");
//new build.BabelPlugin(),

let fuseBox = new FuseBox({
    homeDir: "dist/commonjs",
    //modulesFolder: "test/fixtures/modules",
    cache: false,
    //plugins: [build.HTMLPlugin, build.JSONPlugin, new build.CSSPlugin({ minify: true })]
});
//fuseBox.bundle("**/*.*(js|html) >index.js", false).then(data => {



fuseBox.bundle(">index.js", true).then(data => {
    fs.writeFile("./out.js", data, function(err) {
        if (err) {
            console.log(err);
        }
    });
}).catch(e => {
    console.log(e);
})