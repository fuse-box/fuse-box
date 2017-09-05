import { should } from "fuse-test-runner";
import { createRealNodeModule, FuseTestEnv } from "./stubs/FuseTestEnv";

export class BrowserFieldPackageJsonTest {
    "Should resolve without specific extension"() {
        const name = "fuse_test_a";
        createRealNodeModule(name, {
            "package.json": JSON.stringify({
                name: name,
                browser: {
                    "./hello.js": "./target.js"
                }
            }),
            "index.js": `module.exports = require("./hello.js")`,
            "target.js": `module.exports = {target : "world"}`
        });
        return FuseTestEnv.create(
            {
                project: {
                    target: "browser",
                    files: {
                        "index.ts": `
                            module.exports.data = require("${name}")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            should(index).deepEqual({ data: { target: 'world' } });
        }));
    }

    "Should resolve with specific extension"() {
        const name = "fuse_test_b";
        createRealNodeModule(name, {
            "package.json": JSON.stringify({
                name: name,
                browser: {
                    "./hello.js": "./target.js"
                }
            }),
            "index.js": `module.exports = require("./hello")`,
            "target.js": `module.exports = {target : "world"}`
        });
        return FuseTestEnv.create(
            {
                project: {
                    target: "browser",
                    files: {
                        "index.ts": `
                            module.exports.data = require("${name}")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            should(index).deepEqual({ data: { target: 'world' } });
        }));
    }

    "Should resolve without opening slash in browser field"() {

        const name = "fuse_test_c";
        createRealNodeModule(name, {
            "package.json": JSON.stringify({
                name: name,
                browser: {
                    "hello.js": "./target.js"
                }
            }),
            "index.js": `module.exports = require("./hello")`,
            "target.js": `module.exports = {target : "world"}`
        });
        return FuseTestEnv.create(
            {
                project: {
                    target: "browser",
                    files: {
                        "index.ts": `
                            module.exports.data = require("${name}")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            should(index).deepEqual({ data: { target: 'world' } });
        }));
    }

    "Should resolve without opening slash and without extension in browser field"() {
        const name = "fuse_test_d";
        createRealNodeModule(name, {
            "package.json": JSON.stringify({
                name: name,
                browser: {
                    "hello.js": "target"
                }
            }),
            "index.js": `module.exports = require("./hello")`,
            "target.js": `module.exports = {target : "world"}`
        });
        return FuseTestEnv.create(
            {
                project: {
                    target: "browser",
                    files: {
                        "index.ts": `
                            module.exports.data = require("${name}")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            should(index).deepEqual({ data: { target: 'world' } });
        }));
    }

    "Should resolve by package name"() {
        const name = "fuse_test_e";
        createRealNodeModule(name, {
            "package.json": JSON.stringify({
                name: name,
                browser: {
                    "hello": "target.js"
                }
            }),
            "index.js": `module.exports = require("hello")`,
            "target.js": `module.exports = {target : "world"}`
        });
        return FuseTestEnv.create(
            {
                project: {
                    target: "browser",
                    files: {
                        "index.ts": `
                            module.exports.data = require("${name}")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            should(index).deepEqual({ data: { target: 'world' } });
        }));
    }
}