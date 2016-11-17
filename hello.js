const build = require("./build/commonjs/index.js");

const FuseBox = build.FuseBox;
const fs = require("fs");


let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case2",
    modulesFolder: "test/fixtures/modules",
    cache: true,
    globals: ["default", "wires-reactive"],
    plugins: [build.HTMLPlugin, build.JSONPlugin, new build.CSSPlugin({ minify: true })]
});
//fuseBox.bundle("**/*.*(js|html) >index.js", false).then(data => {

//setInterval(() => {
fuseBox.bundle(">index.js", true).then(data => {
    fs.writeFile("./out.js", data, function(err) {
        if (err) {
            console.log(err);
        }
    });
}).catch(e => {
    console.log(e);
})

//}, 1000)