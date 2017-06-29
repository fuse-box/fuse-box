import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";


export class ImportDynamicJSON {
    "Should import a remote javascript file with Vanilla API (browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "config.json": `{ "hello" : "json" }`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config.json")
                        }
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.getRemoteFile().then(result => {
                should(result).deepEqual({ hello: 'json' });
            });
        }));
    }

    "Should import a remote javascript file with Vanilla API (server)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "config.json": `{ "hello" : "json" }`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config.json")
                        }
                        `
                    }
                }
            }
        ).simple()
            .then(test => test.server(`
                const index = FuseBox.import("./index");
                index.getRemoteFile().then(result => {
                    process.send({response : result})
                });
            `, (data) => {
                    should(data.response).deepEqual({ hello: 'json' })
                }));
    }

    "Should import a remote javascript file with Quantum API (browser, target : browser)"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config.json")
                        }
                        `
                },
                plugins: [QuantumPlugin({
                    target: "browser"
                })]
            }
        }).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                should(result).deepEqual({ hello: 'json' })
            });
        }));
    }

    "Should import a remote javascript file with Quantum API (browser, target : universal)"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config.json")
                        }
                        `
                },
                plugins: [QuantumPlugin({
                    target: "universal"
                })]
            }
        }).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0);
            return index.getRemoteFile().then(result => {
                should(result).deepEqual({ hello: 'json' })
            });
        }));
    }


    "Should import a remote javascript file with Quantum API (server, target : server)"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config.json")
                        }
                        `
                },
                plugins: [QuantumPlugin({
                    target: "universal"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({response : result})
                });
            `, (data) => {
                should(data.response).deepEqual({ hello: 'json' })
            }));;
    }

    "Should NOT import a remote javascript file with Vanilla API (server) NOT FOUND"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config1.json")
                        }
                        `
                }
            }
        }).simple().then(test => test.server(`
                const index = FuseBox.import("./index");
                index.getRemoteFile().then(result => {
                    process.send({response : result})
                }).catch(e => {
                    process.send({error : e.message})
                })
            `, (data) => {
                should(data.error).equal("Cannot find module './config1.json'");
            }));;
    }


    "Should NOT import a remote javascript file with Quantum API (server, target : universal) NOT FOUND"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config1.json")
                        }
                        `
                },
                plugins: [QuantumPlugin({
                    target: "universal"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({response : result})
                }).catch(e => {
                    process.send({error : e.message})
                })
            `, (data) => {
                should(data.error).equal("Cannot find module './config1.json'");
            }));;
    }

    "Should NOT import a remote javascript file with Quantum API (server, target : server) NOT FOUND"() {
        return FuseTestEnv.create({
            project: {

                distFiles: {
                    "config.json": `{ "hello" : "json" }`
                },
                files: {
                    "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./config1.json")
                        }
                        `
                },
                plugins: [QuantumPlugin({
                    target: "server"
                })]
            }
        }).simple().then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({response : result})
                }).catch(e => {
                    process.send({error : e.message})
                })
            `, (data) => {
                should(data.error).equal("Cannot find module './config1.json'");
            }));;
    }
}