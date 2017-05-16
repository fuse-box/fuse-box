
import { createFlatEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class FlatAPItest {
    // "Should create a simple univeral API"() {
    //     return createFlatEnv({
    //         project: {
    //             files: {
    //                 "index.js": `exports.something = require("./foo")`,
    //                 "foo.js": "module.exports = { result : '1'}",
    //             },
    //             instructions: "> index.js",
    //         },
    //     }).then((result) => {
    //         const first = result.window.$fsx.r(0);
    //         should(first).deepEqual({ something: { result: '1' } });
    //     });
    // }

    // "Should give directory name"() {
    //     return createFlatEnv({
    //         project: {
    //             files: {
    //                 "index.js": `exports.out = __dirname`,
    //             },
    //             instructions: "> index.js",
    //         },
    //     }).then((result) => {
    //         const first = result.window.$fsx.r(0);
    //         should(first).deepEqual({ out: "." });
    //     });
    // }

    // "Should give filename"() {
    //     return createFlatEnv({
    //         project: {
    //             files: {
    //                 "index.js": `exports.out = __filename`,
    //             },
    //             instructions: "> index.js",
    //         },
    //     }).then((result) => {
    //         const first = result.window.$fsx.r(0);
    //         should(first).deepEqual({ out: "index.js" });
    //     });
    // }

    "Should understand computed statements"() {
        return createFlatEnv({
            project: {
                files: {
                    "foo/hello.js": `
                        var a = "bar.js";
                        exports.test = require("./" + a)
                    `,
                    "foo/bar.js": `exports.out = __filename`
                },
                instructions: "> **/**.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r("39d0381c");
            should(first).deepEqual({ test: { out: 'foo/bar.js' } });
        });
    }

    // "Should understand computed statements with FuseBox.import"() {
    //     return createFlatEnv({
    //         project: {
    //             files: {
    //                 "foo/hello.js": `
    //                     var a = "bar.js";
    //                     exports.test = FuseBox.import("./" + a)
    //                 `,
    //                 "foo/bar.js": `exports.out = __filename`
    //             },
    //             instructions: "> **/**.js",
    //         },
    //     }).then((result) => {
    //         const first = result.window.$fsx.r("39d0381c");
    //         should(first).deepEqual({ test: { out: 'foo/bar.js' } });
    //     });
    // }

}