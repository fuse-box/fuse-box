import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";


export class ImportDynamicAnythingElse {
    "Should import a remote txt file file with Vanilla API (browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.txt": `some text is here`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./hello.txt")
                        }
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.FuseBox.import("./index");
            return index.getRemoteFile().then(result => {
                should(result).equal("some text is here");
            });
        }));
    }

    "Should import a remote txt file file with Quantum API (browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "hello.txt": `some text is here`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./hello.txt")
                        }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        ).simple().then(test => test.browser(window => {
            const index = window.$fsx.r(0)
            return index.getRemoteFile().then(result => {
                should(result).equal("some text is here");
            });
        }));
    }


    "Should import a txt file with VANILLA API (server)"() {
        return FuseTestEnv.create(
            {
                testFolder: "_current_test",
                project: {
                    distFiles: {
                        "hello.txt": `some text is here`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./hello.txt")
                        }
                        `
                    },
                }
            }
        ).simple()
            .then(test => test.server(`
                const index = FuseBox.import("./index");
                index.getRemoteFile().then(result => {
                    process.send({ response: result});
                });
            `, (data) => {

                    should(data.response).equal(`some text is here`)
                }));
    }

    "Should import a txt file with Quantum API (server)"() {
        return FuseTestEnv.create(
            {
                testFolder: "_current_test",
                project: {
                    distFiles: {
                        "hello.txt": `some text is here`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./hello.txt")
                        }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            extendServerImport: true,
                            target: "server"
                        })
                    ]
                }
            }
        ).simple()
            .then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({ response: result});
                });
            `, (data) => {

                    should(data.response).equal(`some text is here`)
                }));
    }

    "Should not import a txt file with Quantum API (server ) ERROR"() {
        return FuseTestEnv.create(
            {
                testFolder: "_current_test",
                project: {
                    distFiles: {
                        "hello.txt": `some text is here`
                    },
                    files: {
                        "index.ts": `
                        export function getRemoteFile(){ 
                            return import("./hello1.txt")
                        }
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            extendServerImport: true,
                            target: "server"
                        })
                    ]
                }
            }
        ).simple()
            .then(test => test.server(`
                const index = $fsx.r(0);
                index.getRemoteFile().then(result => {
                    process.send({ response: result});
                }).catch(e => {
                    process.send({ error: e.message});
                })
            `, (data) => {
                    should(data.error).findString("no such file or directory");
                }));
    }
}