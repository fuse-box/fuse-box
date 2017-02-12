const should = require("should");
const Utils = require(`../dist/commonjs/Utils.js`);
const path = require("path");

describe("Utils", (done) => {
    it("Should replaceExt correctly with ext", () => {

        let res = Utils.replaceExt("a/hello.ts", ".js")
        res.should.equal("a/hello.js")
    })

    it("Should replaceExt correctly with ext (capital case)", () => {

        let res = Utils.replaceExt("a/hello.TS", ".js")
        res.should.equal("a/hello.js");
    })

    it("Should replaceExt correctly without ext", () => {

        let res = Utils.replaceExt("a/hello", ".js")
        res.should.equal("a/hello.js")
    });


    it("Should find file backwards", () => {
        const rootFolder = path.join(__dirname, "/fixtures/findfile")
        let res = Utils.findFileBackwards(path.join(rootFolder, "a/b/c/tsconfig.json"), rootFolder);
        res.should.match(/findfile\/a\/b\/tsconfig.json$/);
    });
});