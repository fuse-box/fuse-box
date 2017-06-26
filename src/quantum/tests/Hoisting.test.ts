import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class TreeShakeTest {
    // "Should not tree shake Foo2"() {
    //     return createOptimisedBundleEnv({
    //         stubs: true,
    //         options: {
    //             treeshake: true
    //         },
    //         project: {
    //             files: {

    //                 "lib.ts": `export function hello(){}`,
    //                 "a.ts": `
    //                     import {hello} from "./lib";
    //                     hello();
    //                 `,
    //                 "b.ts": `
    //                     import {hello} from "./lib";
    //                     hello();
    //                 `
    //             },
    //             instructions: "**/**.ts",
    //         },
    //     }).then((result) => {
    //         const contents = result.contents["index.js"];
    //         console.log(contents);

    //     });
    // }


    "Should not hoist"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                hoisting: true,
                treeshake: true
            },
            project: {
                files: {

                    "index.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
                    "reflux.ts": `
                        
                    `
                },
                instructions: "**/**.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("var Reflux = $fsx.r(1);\nReflux.createAction();");
        });
    }

    "Should hoist cuz of 2 mentions"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                hoisting: true,
                treeshake: true
            },
            project: {
                files: {

                    "index.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
                    "some.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
                    "reflux.ts": `
                        
                    `
                },
                instructions: "**/**.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("var Reflux = $fsx.r(1);\n})($fsx);");
        });
    }

}
