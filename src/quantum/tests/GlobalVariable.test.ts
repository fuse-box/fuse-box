import { should } from "fuse-test-runner";

import { QuantumPlugin } from "../../index";
import { FuseTestEnv } from "../../tests/stubs/FuseTestEnv";


export class GlobalVariableTEst {
    "Should wotk with server on server"() {
        return FuseTestEnv.create({

            project: {
                files: {
                    "index.ts": `
                        global.foo = "bar"
                        module.exports = global.foo
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
                should(data.response).equal("bar");
            }));;
    }

    "Should wotk with server on browser"() {
        return FuseTestEnv.create(
            {

                project: {
                    files: {
                        "index.ts": `
                        global.foo = "bar"
                        module.exports = global.foo
                    `
                    },
                    plugins: [QuantumPlugin({
                        target: "browser"
                    })]
                },
            }
        ).simple().then(test => test.browser(window => {
            const res = window.$fsx.r(0);
            should(res).equal("bar");
        }));
    }

    public "Should replace require statement"() {
        return FuseTestEnv.create(

            {
                testFolder: "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            const req = require
                            module.exports = req('s');
                    `
                    },
                    plugins: [QuantumPlugin({
                        target: "browser"
                    })]
                }
            }
        ).simple().then(test => test.browser((window, env) => {
            const app = env.getScript("app.js");
            app.shouldNotFindString('require');
        }));
    }


    public "Should not replace require statement"() {
        return FuseTestEnv.create(

            {
                testFolder: "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            module.exports = require.main.filename;
                    `
                    },
                    plugins: [QuantumPlugin({
                        target: "browser"
                    })]
                }
            }
        ).simple().then(test => test.browser((window, env) => {
            const app = env.getScript("app.js");
            app.shouldFindString("require.main.filename");
        }));
    }

    public "Should not replace require statement 1"() {
        return FuseTestEnv.create(

            {
                testFolder: "_current_test",
                project: {
                    files: {
                        "index.ts": `
                            module.exports = {require : 1};
                    `
                    },
                    plugins: [QuantumPlugin({
                        target: "browser"
                    })]
                }
            }
        ).simple().then(test => test.browser((window, env) => {
            const app = env.getScript("app.js");
            app.shouldFindString("{ require: 1 }");
        }));
    }

    public "Should not replace require statement 2"() {
        return FuseTestEnv.create(
            {
                project: {
                    files: {
                        "index.ts": `
                        if (typeof require !== 'undefined' && require.extensions) {
                        }
                    `
                    },
                    plugins: [QuantumPlugin({
                        target: "browser",
                        replaceTypeOf: false
                    })]
                }
            }
        ).simple().then(test => test.browser((window, env) => {
            const app = env.getScript("app.js");
            app.shouldFindString("typeof require");
        }));
    }

}
