import { should } from "fuse-test-runner";

import { QuantumPlugin } from "../../index";
import { FuseTestEnv } from "../../tests/stubs/FuseTestEnv";


export class ImportDynamicJSON {
    "Should execute node module (path) UNIVERSAL (path polyfilled)"() {
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

    "Should execute node module (path) UNIVERSAL (path excluded)"() {
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
        }).simple("[index.ts]").then(test => test.server(`
                const index = $fsx.r(0);
                process.send({response : index})

            `, (data) => {
                should(data.response).equal("a");
            }));;
    }

    "Should execute node module (path) SERVER (path polyfilled)"() {
        return FuseTestEnv.create({
            project: {
                files: {
                    "index.ts": `
                        module.exports = require("path").join('a')
                        `
                },
                plugins: [QuantumPlugin({
                    target: "server"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                process.send({response : index})

            `, (data) => {
                should(data.response).equal("a");
            }));;
    }
    "Should execute node module (path) SERVER (path excluded)"() {
        return FuseTestEnv.create({
            testFolder: "_current_test",
            project: {
                files: {
                    "index.ts": `
                        module.exports = require("path").join('a')
                        `
                },
                plugins: [QuantumPlugin({
                    target: "server"
                })]
            }
        }).simple("[index.ts]").then(test => test.server(`
                const index = $fsx.r(0);
                process.send({response : index})
                
            `, (data) => {

                should(data.response).equal("a");
            }));;
    }

}