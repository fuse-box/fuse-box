import { should } from "fuse-test-runner";
import { createEnv } from "./stubs/TestEnvironment";
import { UglifyJSPlugin } from "../plugins/UglifyJSPlugin";

export class UglifyJSPluginTest {
    "Should return compressed js 1"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `
                var longVar = 'str1';
                var longVar2 = 'str2';
                module.exports = function () {return longVar + ' ' + longVar2;}
                `,
                },
                plugins: [UglifyJSPlugin()],
                instructions: ">index.ts",
            },
        }).then((result) => {
            result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();
            should(contents).findString("str1 str2");
        });
    }

    // @TODO: throws error about a string not being a buffer...
    // "Should respect config"() {
    //     return createEnv({
    //         project: {
    //             files: {
    //                 "index.ts": `
    //                 var objectWithProps = {
    //                   uglifyme: true,
    //                   nestedEven: {
    //                     down: {
    //                       down: {
    //                         down: true,
    //                       },
    //                     },
    //                   },
    //                 }
    //
    //                 export default objectWithProps
    //               `,
    //             },
    //             globals: { default: "__compressed__" },
    //             plugins: [UglifyJSPlugin({mangle: {
    //                 props: true,
    //             }})],
    //             instructions: ">index.ts",
    //         },
    //     }).then((result) => {
    //         const out = result.project.FuseBox.import("./index");
    //         should(("nestedEven" in result.project)).beFalse();
    //     });
    // }

    "Should return __compressed__ js 2"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `
                  var longVar = 'str1';
                  var longVar2 = 'str2';
                  module.exports = function () {return longVar + ' ' + longVar2;}
                  `,
                },
                globals: { default: "__compressed__" },
                plugins: [UglifyJSPlugin()],
                instructions: ">index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            should(("__compressed__" in result.project)).beTrue();
            should(result.project.__compressed__()).findString("str1 str2");
        });
    }
}
