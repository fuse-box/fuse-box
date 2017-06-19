import { should } from "fuse-test-runner";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { QuantumPlugin } from "../../index";


export class ImportDynamicCssTest {
    "Should import a remote css file with Vanilla API (browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "main.css": `
                            body: {
                                background-color:red;
                            }
                        `
                    },
                    files: {
                        "index.ts": `
                            import("./main.css")
                        `
                    }
                }
            }
        ).simple().then(test => test.browser(window => {
            window.FuseBox.import("./index");
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    should(window.document.querySelectorAll("link")[0].attributes.href.value).equal("./main.css")
                    return resolve();
                }, 1);
            });
        }));
    }

    "Should import a remote css file with Quantum API (browser : browser)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "main.css": `
                            body: {
                                background-color:red;
                            }
                        `
                    },
                    files: {
                        "index.ts": `
                            import("./main.css")
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
            window.$fsx.r(0)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    should(window.document.querySelectorAll("link")[0].attributes.href.value).equal("./main.css")
                    return resolve();
                }, 1);
            });
        }));
    }

    "Should import a remote css file with Quantum API (browser : universal)"() {
        return FuseTestEnv.create(
            {
                project: {
                    distFiles: {
                        "main.css": `
                            body: {
                                background-color:red;
                            }
                        `
                    },
                    files: {
                        "index.ts": `
                            import("./main.css")
                        `
                    },
                    plugins: [
                        QuantumPlugin({
                            target: "universal"
                        })
                    ]
                }
            }
        ).simple().then(test => test.browser(window => {
            window.$fsx.r(0)
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    should(window.document.querySelectorAll("link")[0].attributes.href.value).equal("./main.css")
                    return resolve();
                }, 1);
            });
        }));
    }

}