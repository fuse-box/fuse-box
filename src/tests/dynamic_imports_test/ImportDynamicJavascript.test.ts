import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";


export class ImportDynamicJavascript {
    "Should import a remote javascript file with Vanilla API (browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                    },
                    files: {
                        "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.getRemoteFile().then(result => {
                should(result.remoteFN()).equal(`some result from a remote file`);
            });
        }));
    }

    "Should import a remote javascript file with Vanilla API (server)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                    },
                    files: {
                        "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                    }
                }
            }
        ).simple()
            .then(test => test.server(`
                const index = FuseBox.import("./index");
                index.getRemoteFile().then(result => {
                    process.send({ response: result.remoteFN()});
                });
            `, (data) => {
                    should(data.response).equal(`some result from a remote file`)
                }));
    }

    "Should import a remote javascript file with Quantum API (browser, target : browser)"() {
        return FuseTestEnv.create({
            project: {
                distFiles: {
                    "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                },
                files: {
                    "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                },
                plugins: [QuantumPlugin({
                    target: "browser"
                })]
            }
        }).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                should(result.remoteFN()).equal(`some result from a remote file`);
            });
        }));
    }

    "Should import a remote javascript file with Quantum API (browser, target : univeral)"() {
        return FuseTestEnv.create({
            project: {
                distFiles: {
                    "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                },
                files: {
                    "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                },
                plugins: [QuantumPlugin({
                    target: "universal"
                })]
            }
        }).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                should(result.remoteFN()).equal(`some result from a remote file`);
            });
        }));
    }

    "Should import a remote javascript file with Quantum API (server, target : server)"() {
        return FuseTestEnv.create({
            project: {
                distFiles: {
                    "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                },
                files: {
                    "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                },
                plugins: [QuantumPlugin({
                    target: "server"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({ response: result.remoteFN()});
                });
            `, (data) => {
                should(data.response).equal(`some result from a remote file`)
            }));
    }

    "Should fail to import import a remote javascript file with Quantum API (browser, target : browser) (NOT FOUND)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                    },
                    files: {
                        "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello2.js")
                    }`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                throw "Should not happen";
            }).catch(e => {
                should(e.code).equal(404);
            });
        }));
    }

    "Should fail to import import a remote javascript file with Quantum API (browser, target : universal) (NOT FOUND)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                    },
                    files: {
                        "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello2.js")
                    }`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "universal"
                        })
                    ]
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                throw "Should not happen";
            }).catch(e => {
                should(e).deepEqual({ code: 404, msg: 'Not Found' });
            });
        }));
    }

    "Should fail trying to execute a Quantum server Build in browser"() {
        return FuseTestEnv.create({
            project: {
                distFiles: {
                    "hello.js": "exports.remoteFN = function(){ return 'some result from a remote file'}"
                },
                files: {
                    "index.ts": `
                    export function getRemoteFile(){ 
                        return import("./hello.js")
                    }`
                },
                plugins: [QuantumPlugin({
                    target: "server"
                })]
            }
        }).simple().then(test => test.browser(window => {
            should(window.$fsx).beUndefined();
        }));
    }
}