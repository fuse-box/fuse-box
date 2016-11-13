const build = require("./build/commonjs/index.js");
const FuseBox = build.FuseBox;
const fs = require("fs");

let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1",
    cache: false,
    // fileCollection: {
    //     "index.js": "require('./foo/bar.js')",
    //     "foo/bar.js": "require('../hello.js')",
    //     "hello.js": "",
    // }
});
fuseBox.bundle("> index.js", true).then(data => {
    fs.writeFile("./out.js", data, function(err) {});
}).catch(e => {
    console.log(e);
})