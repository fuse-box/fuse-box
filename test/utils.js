const should = require("should");
const Utils = require(`../${process.env.TRAVIS ? "dist" : "build"}/commonjs/Utils.js`);

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
    })


});