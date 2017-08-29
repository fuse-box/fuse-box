import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class TypeOfReplacementTest {
    "should get rid of typeof module"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeUseStrict: false
            },
            project: {
                files: {
                    "index.ts": `module.exports = {result : typeof module === "object"}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).findString("'object' === 'object'");
        });
    }
    "should get rid of typeof exports"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `module.exports = {result : typeof exports === "object"}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("'object' === 'object'");
        });
    }


    "should replace typeof module"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `
                       function hello(){
                        if (typeof module === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("'object' === 'string'")
        });
    }

    "should preserve typeof module in case of a local variable"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `
                       function hello(module){
                        if (typeof module === "string") {
                            return module;
                        }
                       }
                       module.exports.something = hello("123123")

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("typeof module === 'string'");
        });
    }



    "should replace typeof global"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `
                       function hello(){
                        if (typeof global === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("'undefined' === 'string'")
        });
    }

    "should not replace typeof global"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `
                       function hello(global){
                        if (typeof global === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("typeof global === 'string'")
        });
    }

    "should preserve typeof module in case of a local variable (2)"() {
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.ts": `
                       function hello(){
                            var module = 1;
                            var t = typeof module;
                       }
                       module.exports.something = hello("123123")
                    
                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("var t = typeof module");
        });
    }
}
