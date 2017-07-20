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
                }
            }
        ).simple().then(test => test.browser(window => {
            const res = window.$fsx.r(0);
            should(res).equal("bar");
        }));
    }

}