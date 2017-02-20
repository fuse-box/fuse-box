import should = require("should");
const getTestEnv = require("./fixtures/lib").getTestEnv;

describe("Wildcard imports", () => {

    it("Should import 2 javascript files without ext", (done) => {
        getTestEnv({

            "foo/a.js": "module.exports = {a : 1}",
            "foo/b.js": "module.exports = {b : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./foo/*");
            result.should.deepEqual({ 'foo/a.js': { a: 1 }, 'foo/b.js': { b: 1 } })
            done();
        }).catch(done);
    });

    it("Should import 2 javascript files with ext", (done) => {
        getTestEnv({

            "foo/a.js": "module.exports = {a : 1}",
            "foo/b.js": "module.exports = {b : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./foo/*.js");
            result.should.deepEqual({ 'foo/a.js': { a: 1 }, 'foo/b.js': { b: 1 } })
            done();
        }).catch(done);
    });

    it("Should import 2 javascript files without ext and a mask ", (done) => {
        getTestEnv({

            "foo/a-comp.js": "module.exports = {a : 1}",
            "foo/b-comp.js": "module.exports = {b : 1}",
            "foo/c.js": "module.exports = {c : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./foo/*-comp");
            result.should.deepEqual({ 'foo/a-comp.js': { a: 1 }, 'foo/b-comp.js': { b: 1 } })
            done();
        }).catch(done);
    });

    it("Should import 2 javascript files with ext and a mask ", (done) => {
        getTestEnv({

            "foo/a-comp.js": "module.exports = {a : 1}",
            "foo/b-comp.js": "module.exports = {b : 1}",
            "foo/c.js": "module.exports = {c : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./foo/*-comp.js");
            result.should.deepEqual({ 'foo/a-comp.js': { a: 1 }, 'foo/b-comp.js': { b: 1 } })
            done();
        }).catch(done);
    });

    it("Should import 2 json files with wild card", (done) => {
        getTestEnv({

            "foo/a.json": "module.exports = {a : 1}",
            "foo/b.json": "module.exports = {b : 1}"
        }, "**/*.**").then(root => {
            let result = root.FuseBox.import("./foo/*");
            result.should.deepEqual({ 'foo/a.json': { a: 1 }, 'foo/b.json': { b: 1 } })
            done();
        }).catch(done);
    });

    it("Should import 2 json files with wild card and a mask", (done) => {
        getTestEnv({

            "foo/a.json": "module.exports = {a : 1}",
            "foo/b.json": "module.exports = {b : 1}"
        }, "**/*.**").then(root => {
            let result = root.FuseBox.import("./foo/*.json");
            result.should.deepEqual({ 'foo/a.json': { a: 1 }, 'foo/b.json': { b: 1 } })
            done();
        }).catch(done);
    });


    it("Should import 2 javascript capital case", (done) => {
        getTestEnv({

            "foo/A.js": "module.exports = {a : 1}",
            "foo/B.js": "module.exports = {b : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("./foo/*");

            result.should.deepEqual({ 'foo/A.js': { a: 1 }, 'foo/B.js': { b: 1 } })
            done();
        }).catch(done);
    });

})