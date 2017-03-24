import {createEnv} from "./stubs/TestEnvironment";
import {should} from "fuse-test-runner";

export class DynamicModulesTest {
    "Should access a dynamic module (without ext)"() {
        return createEnv({
            project: {
                files: {
                    "hello.js": `module.exports = require("./stuff/boo");`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

            should(fuse.import("./hello"))
                .deepEqual({hello: "dynamic"});
        });
    }

    "Should access a dynamic module (with ext)"() {
        return createEnv({
            project: {
                files: {
                    "hello.js": `module.exports = require("./stuff/boo.js");`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

            should(fuse.import("./hello"))
                .deepEqual({hello: "dynamic"});
        });
    }

    "Should access a dynamic module with tilde (with ext)"() {
        return createEnv({
            project: {
                files: {
                    "hello.js": `module.exports = require("~/stuff/boo.js");`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

            should(fuse.import("./hello"))
                .deepEqual({hello: "dynamic"});
        });
    }

    "Should access a dynamic module with tilde (without ext)"() {
        return createEnv({
            project: {
                files: {
                    "hello.js": `module.exports = require("~/stuff/boo");`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

            should(fuse.import("./hello")).deepEqual({hello: "dynamic"});
        });
    }

    "Dynamic module should have access to the scope (with ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "exports.itworks = require('../foo.js')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index");
            should(fuse.import("./hello/world"))
                .deepEqual({
                    "itworks": {
                        "foo": "bar"
                    }
                });
        });
    }

    "Dynamic module should have access to the scope (without ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "exports.itworks = require('../foo')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index");
            should(fuse.import("./hello/world"))
                .deepEqual({
                    "itworks": {
                        "foo": "bar"
                    }
                });
        });
    }

    "Dynamic module should have access to the scope using tilde (without ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");

            should(fuse.import("./hello/world.js"))
                .deepEqual({foo: "bar"});
        });
    }

    "Dynamic module should have access to the scope using tilde (with ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");

            should(fuse.import("./hello/world.js"))
                .deepEqual({foo: "bar"});
        });
    }

    "Dynamic module can be overridden"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");
            fuse.dynamic("hello/world.js", "module.exports = {'yes' : true}");

            should(fuse.import("./hello/world.js"))
                .deepEqual({yes: true});
        });
    }

    "FuseBox.exists should return true on dynamic module"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
                    "foo.js": `module.exports = {foo : "bar"}`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");

            should(fuse.exists("./hello/world.js"))
                .equal(true);
        });
    }

    "FuseBox.exists should not throw if module is not found"() {
        return createEnv({
            project: {
                files: {"index.js": ``},
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");

            should(fuse.exists("app.html"))
                .equal(false);
        });
    }

    "Should register a module in a different package"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
            FuseBox.dynamic(
                "hello/world.js", 
                "module.exports = {hello : 'world'}", 
                {pkg : 'foo'}
            )`
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            fuse.import("./index.js");

            should(fuse.import("foo/hello/world"))
                .deepEqual({hello: "world"});
        });
    }

}
