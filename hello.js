const build = require("./build/commonjs/index.js");

const getAbsoluteEntryPath = build.getAbsoluteEntryPath;
const Module = build.Module;
const FuseBox = build.FuseBox;
const ModuleCollection = build.ModuleCollection;
const fs = require("fs");

let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1",
    fileCollection: {
        "index.js": "require('./foo/bar.js')",
        "foo/bar.js": "require('../hello.js')",
        "hello.js": "",
    }
});
fuseBox.bundle("> index.js **/*.js", true).then(content => {
    fs.writeFileSync("./out.js", content);
})