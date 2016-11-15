const should = require("should");
const getTestEnv = require("./fixtures/lib.js").getTestEnv;

describe("Generic requires", (done) => {

    it("Case 1", (done) => {
        getTestEnv({
            "index.js": `require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = {bar : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("foo/bar");
            result.should.deepEqual({ bar: 1 });
            done();
        }).catch(done);
    });

    it("Case 2 should import 3 files", (done) => {
        getTestEnv({
            "index.js": `exports.hello = require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = require('./hello.js')",
            "foo/hello.js": "module.exports = {bar : 1}",
        }, "**/*.js").then(root => {

            let result = root.FuseBox.import("index");
            result.should.deepEqual({ hello: { bar: 1 } });
            done();
        }).catch(done);
    });

    it("Should call an entry point", (done) => {
        getTestEnv({
            "index.js": `__root__.allGood = require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = require('./hello.js')",
            "foo/hello.js": "module.exports = {bar : 1}",
        }, "> index.js").then(root => {
            should.equal(root.allGood.bar, 1)
            done();
        }).catch(done);
    });

    it("Should import with extension", (done) => {
        getTestEnv({
            "index.js": `module.exports = require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = require('./hello.js')",
            "foo/hello.js": "module.exports = {bar : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("foo/bar.js");
            result.should.deepEqual({ bar: 1 });
            done();
        }).catch(done);
    });

    it("Should import using tilde", (done) => {
        getTestEnv({
            "index.js": `module.exports = require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = require('~/foo/hello.js')",
            "foo/hello.js": "module.exports = {bar : 1}",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("foo/bar.js");
            result.should.deepEqual({ bar: 1 });
            done();
        }).catch(done);
    });

    it("Should export with 'exports'", (done) => {
        getTestEnv({
            "index.js": `module.exports = require("./foo/bar.js");`,
            "foo/bar.js": "module.exports = require('~/foo/hello.js')",
            "foo/hello.js": "exports.bar = 2",
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("foo/bar.js");
            result.should.deepEqual({ bar: 2 });
            done();
        }).catch(done);
    });

    it("Should cache a module", (done) => {
        getTestEnv({
            "index.js": `var a = 0; a++; exports.counter = a;`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ counter: 1 });

            let result2 = root.FuseBox.import("index");
            result2.should.deepEqual({ counter: 1 });
            done();
        }).catch(done);
    });

    it("Should require a folder", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = {bar : 10}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 10 } });
            done();
        }).catch(done);
    });

    it("Should require a folder with tilde", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("~/bar")`,
            "bar/index.js": `module.exports = {bar : 20}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 20 } });
            done();
        }).catch(done);
    });

    it("Should require a folder with tilde (without ext)", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("~/bar/index")`,
            "bar/index.js": `module.exports = {bar : 20}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 20 } });
            done();
        }).catch(done);
    });

    it("Should require a folder with tilde (with ext)", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("~/bar/index.js")`,
            "bar/index.js": `module.exports = {bar : 20}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 20 } });
            done();
        }).catch(done);
    });

    it("Should require a relative require statement (folder)", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("../bar")`,
            "bar/index.js": `module.exports = {bar : 30}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 30 } });
            done();
        }).catch(done);
    });

    it("Should require a relative require statement (file without ext)", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("../bar/index")`,
            "bar/index.js": `module.exports = {bar : 30}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 30 } });
            done();
        }).catch(done);
    });

    it("Should require a relative require statement (file with ext)", (done) => {
        getTestEnv({
            "index.js": `exports.foo = require("./foo")`,
            "foo/index.js": `module.exports = require("../bar/index.js")`,
            "bar/index.js": `module.exports = {bar : 30}`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("index");
            result.should.deepEqual({ foo: { bar: 30 } });
            done();
        }).catch(done);
    });

    it("Should handle circular dependency", (done) => {
        getTestEnv({
            "a.js": `exports.a = 1; require("./b")`,
            "b.js": `exports.b = require("./a")`,
        }, "**/*.js").then(root => {
            let result = root.FuseBox.import("b");
            result.should.deepEqual({ b: { a: 1 } });
            done();
        }).catch(done);
    });
})