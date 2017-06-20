import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";


export class ImportDynamicSplitBundles {
    "Should load a split bundle by [NAME] (VANILLA) browser"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("oi") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    }
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.FuseBox.import("./index");
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }

    "Should load a split bundle by [PATH] (VANILLA) browser"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("./oi/a") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    }
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.FuseBox.import("./index");
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }


    "Should load a split bundle by [PATH] (VANILLA) server"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("./oi/a") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    }
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.server(`
                const index = FuseBox.import("./index");
                index.load().then(result => {
                    process.send({response : result.oi()})
                })
            `, (result) => {
                    should(result.response).equal("oi mate");
                }));;
    }


    "Should load a split bundle by [NAME] (QUANTUM) (target:browser on BROWSER)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("oi") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.$fsx.r(0)
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }

    "Should load a split bundle by [NAME] (QUANTUM) (target:universal on BROWSER)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("oi") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "universal"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.$fsx.r(0)
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }

    "Should load a split bundle by [NAME] (QUANTUM) (target:server on server)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("oi") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "server"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.server(`
                const index = $fsx.r(0)
                index.load().then(result => {
                    process.send({response : result.oi()})
                })
            `, (result) => {
                    should(result.response).equal("oi mate");
                }));;
    }


    "Should load a split bundle by [PATH] (QUANTUM) (target:browser on BROWSER)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("./oi/a") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "browser"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.$fsx.r(0)
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }

    "Should load a split bundle by [PATH] (QUANTUM) (target:universal on BROWSER)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("./oi/a") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "universal"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.browser(window => {
                const index = window.$fsx.r(0)
                return index.load().then(result => {
                    should(result.oi()).equal("oi mate");
                });
            }));
    }

    "Should load a split bundle by [PATH] (QUANTUM) (target:server on server)"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                            export function load() { 
                                return import("./oi/a") 
                            }
                        `,
                        "oi/a.ts": `export function oi(){ return "oi mate";}`
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "server"
                        })
                    ]
                }
            }
        )
            .config(fuse => {
                fuse
                    .bundle("app")
                    .split("oi/**", "oi > oi/a.ts")
                    .instructions("> index.ts **/**.ts")

            }).then(test => test.server(`
                const index = $fsx.r(0)
                index.load().then(result => {
                    process.send({response : result.oi()})
                })
            `, (result) => {
                    should(result.response).equal("oi mate");
                }));;
    }

}