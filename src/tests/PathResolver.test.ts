import {createEnv} from "./stubs/TestEnvironment";
import {should} from "fuse-test-runner";

export class PathResolverTest {
    "Should Find .js (file)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `module.exports = require("./woo/hello");`,
                    "woo/hello.js": "module.exports = {ok : 1 }",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }

    "Should Find .ts (file)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `module.exports = require("./woo/hello");`,
                    "woo/hello.ts": "module.exports = {ok : 1 }",
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }

    "Should Find .tsx (file)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `module.exports = require("./woo/hello");`,
                    "woo/hello.tsx": "module.exports = {ok : 1 }",
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }

    "Should Find .js (folder)"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `module.exports = require("./woo/hello");`,
                    "woo/hello/index.js": "module.exports = {ok : 1 }",
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }

    "Should Find .ts (folder)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `module.exports = require("./woo/hello");`,
                    "woo/hello/index.ts": "module.exports = {ok : 1 }",
                },
                instructions: "**/*.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }

    "Should Find .tsx (folder)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `module.exports = require("./woo/hello");`,
                    "woo/hello/index.tsx": "module.exports = {ok : 1 }",
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(out).deepEqual({ok: 1});
        });
    }
}