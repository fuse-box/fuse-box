import {createEnv} from "./stubs/TestEnvironment";
import {should} from "fuse-test-runner";

export class GenericRequireTest {
    "Should Case 1"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = {bar : 1}",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 1});
        });
    }

    "Should import 3 files"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.hello = require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = require('./hello.js')",
                    "foo/hello.js": "module.exports = {bar : 1}",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 1});
        });
    }

    "Should  call an entry poin"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.allGood = require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = require('./hello.js')",
                    "foo/hello.js": "module.exports = {bar : 1}",
                },
                instructions: "> index.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 1});
        });
    }

    "Should  import with extension"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `module.exports = require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = require('./hello.js')",
                    "foo/hello.js": "module.exports = {bar : 1}",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 1});
        });
    }

    "Should import using tilde"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `module.exports = require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = require('~/foo/hello.js')",
                    "foo/hello.js": "module.exports = {bar : 1}",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 1});
        });
    }

    "Should export with 'exports'"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `module.exports = require("./foo/bar.js");`,
                    "foo/bar.js": "module.exports = require('~/foo/hello.js')",
                    "foo/hello.js": "exports.bar = 2",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./foo/bar");
            should(out).deepEqual({bar: 2});
        });
    }

    "Should cache a module"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `var a = 0; a++; exports.counter = a;`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            let out1 = result.project.FuseBox.import("./index");
            should(out1).deepEqual({counter: 1});

            let out2 = result.project.FuseBox.import("./index");
            should(out2).deepEqual({counter: 1});
        });
    }

    "Should require a folder"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = {bar : 10}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 10}});
        });
    }

    "Should require a folder with tilde"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("~/bar")`,
                    "bar/index.js": `module.exports = {bar : 20}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 20}});
        });
    }

    "Should require a folder with tilde (without ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("~/bar/index")`,
                    "bar/index.js": `module.exports = {bar : 20}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 20}});
        });
    }

    "Should require a folder with tilde (with ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("~/bar/index.js")`,
                    "bar/index.js": `module.exports = {bar : 20}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 20}});
        });
    }

    "Should require a relative require statement (folder)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("../bar")`,
                    "bar/index.js": `module.exports = {bar : 30}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 30}});
        });
    }

    "Should require a relative require statement (file without ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("../bar/index")`,
                    "bar/index.js": `module.exports = {bar : 30}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 30}});
        });
    }

    "Should require a relative require statement (file with ext)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `exports.foo = require("./foo")`,
                    "foo/index.js": `module.exports = require("../bar/index.js")`,
                    "bar/index.js": `module.exports = {bar : 30}`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({foo: {bar: 30}});
        });
    }

    "Should handle circular dependency"() {
        return createEnv({
            project: {
                files: {
                    "a.js": `exports.a = 1; require("./b");`,
                    "b.js": `exports.b = require("./a")`,
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./b");
            should(out).deepEqual({b: {a: 1}});
        });
    }

}
