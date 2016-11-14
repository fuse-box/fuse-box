const build = require("../build/commonjs/index.js");
const should = require("should");
const FuseBox = build.FuseBox;

let getCollection = (files) => {
    return new FuseBox({
        log: true,
        fileCollection: files
    });
}

describe("A simple case on directory case-a without npm deps", () => {
    it("Should work", (done) => {
        var fsb = getCollection({
            "index.js": `require("./foo/bar.js")`,
            "foo/bar.js": ""
        });
        fsb.bundle("**/*.js").then(data => {
            console.log(data);
        })

    });

})