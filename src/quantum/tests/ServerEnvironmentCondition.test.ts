import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";
import { FuseTestEnv } from "../../tests/stubs/FuseTestEnv";
import { QuantumPlugin } from "../plugin/QuantumPlugin";

export class ServerEnvironmentConditionTest {
    "Should handle FuseBox.isServer"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = FuseBox.isServer`
                },
                instructions: "> index.js",
            },
        }).then((result) => {

            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: false });
        });
    }

    "Should handle FuseBox.isBrowser"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = FuseBox.isBrowser`
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);

            should(first).deepEqual({ something: true });
        });
    }



    "Should handle  isServer in a list"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = [FuseBox.isServer]`
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: [false] });
        });
    }
    "Should handle  isServer and isBrowser in a list"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = [FuseBox.isServer, FuseBox.isBrowser]`
                },
                instructions: "index.js",
            },
        }).then((result) => {

            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: [false, true] });
        });
    }


    "Should replace if statements (dead code)"() {
        return createOptimisedBundleEnv({
            stubs: true,

            project: {

                files: {
                    "index.js": `
                        if (FuseBox.isServer){
                            console.log("server")
                        }
                    `
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString("server");
        });
    }

    "Should replace if statements (dead code) -> alternate"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `
                        if (FuseBox.isServer){
                            console.log("server")
                        } else {
                            console.log("browser")
                        }
                    `
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString("server");
            should(contents).findString("browser");
        });
    }

    "Should handlle universal target on server"() {
        return FuseTestEnv.create({
            project: {
                files: {
                    "index.ts": `
                        module.exports = require("path").join('a')
                        `
                },
                plugins: [QuantumPlugin({
                    target: "universal"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                process.send({response : index})

            `, (data) => {
                should(data.response).equal("a");
            }));;
    }


    "Should handlle FuseBox.target"() {
        return FuseTestEnv.create({
            project: {
                files: {
                    "index.ts": `
                        module.exports = FuseBox.target
                        `
                },
                plugins: [QuantumPlugin({
                    target: "electron"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                process.send({response : index})

            `, (data) => {
                ;
                should(data.response).equal("electron");
            }));;
    }
}