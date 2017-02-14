const should = require("should");
const getTestEnv = require("./fixtures/lib.js").getTestEnv;

describe("Dynamic modules", (done) => {

    it("Should access a dynamic module (without ext)", (done) => {
        getTestEnv({
            "hello.js": `module.exports = require("./stuff/boo");`,
        }, "**/*.js").then(root => {
            root.FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}")
            let result = root.FuseBox.import("./hello");
            result.should.deepEqual({hello: 'dynamic'});
            done();
        }).catch(done);
    });

    it("Should access a dynamic module (with ext)", (done) => {
        getTestEnv({
            "hello.js": `module.exports = require("./stuff/boo.js");`,
        }, "**/*.js").then(root => {
            root.FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}")
            let result = root.FuseBox.import("./hello");
            result.should.deepEqual({hello: 'dynamic'});
            done();
        }).catch(done);
    });

    it("Should access a dynamic module with tilde (with ext)", (done) => {
        getTestEnv({
            "hello.js": `module.exports = require("~/stuff/boo.js");`,
        }, "**/*.js").then(root => {
            root.FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}")
            let result = root.FuseBox.import("./hello");
            result.should.deepEqual({hello: 'dynamic'});
            done();
        }).catch(done);
    });

    it("Should access a dynamic module with tilde (without ext)", (done) => {
        getTestEnv({
            "hello.js": `module.exports = require("~/stuff/boo");`,
        }, "**/*.js").then(root => {
            root.FuseBox.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}")
            let result = root.FuseBox.import("./hello");
            result.should.deepEqual({hello: 'dynamic'});
            done();
        }).catch(done);
    });

    it("Dynamic module should have access to the scope (with ext)", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "__root__.itworks = require('../foo.js')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            root.FuseBox.import("./hello/world");
            root.itworks.should.deepEqual({foo: "bar"})
            done();
        }).catch(done);
    });

    it("Dynamic module should have access to the scope (without ext)", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "__root__.itworks = require('../foo')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            root.FuseBox.import("./hello/world");
            root.itworks.should.deepEqual({foo: "bar"})
            done();
        }).catch(done);
    });

    it("Dynamic module should have access to the scope using tilde (without ext)", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            let res = root.FuseBox.import("./hello/world");
            res.should.deepEqual({foo: "bar"})
            done();
        }).catch(done);
    });

    it("Dynamic module should have access to the scope using tilde (with ext)", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            let res = root.FuseBox.import("./hello/world");
            res.should.deepEqual({foo: "bar"})
            done();
        }).catch(done);
    });

    it("Dynamic module can be overriden", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            root.FuseBox.dynamic("hello/world.js", "module.exports = {'yes' : true}")
            let res = root.FuseBox.import("./hello/world");
            res.should.deepEqual({yes: true})
            done();
        }).catch(done);
    });

    it("FuseBox.exists should return true on dynamic module", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
            "foo.js": `module.exports = {foo : "bar"}`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            let res = root.FuseBox.exists("./hello/world.js");
            res.should.equal(true)
            done();
        }).catch(done);
    });

    it("FuseBox.exists should not throw if module is not found", (done) => {
        getTestEnv({
            "index.js": ``,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            let res = root.FuseBox.exists("app.html");
            res.should.equal(false)
            done();
        }).catch(done);
    });

    it("Should register a module in a different package", (done) => {
        getTestEnv({
            "index.js": `
            FuseBox.dynamic(
                "hello/world.js", 
                "module.exports = {hello : 'world'}", 
                {pkg : 'foo'}
            )`,
        }, "**/*.js").then(root => {
            root.FuseBox.import("./index");
            root.FuseBox.import("foo/hello/world").should.deepEqual({hello: "world"});
            done();
        }).catch(done);
    });

})