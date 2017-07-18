
import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";
import { EnvPlugin } from "../../index";


export class ProcessEnvReplacement {
    "Should replace process env NODE_ENV"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                files: {
                    "index.ts": `exports.env = process.env.NODE_ENV`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("exports.env = 'production'");
        });
    }

    "Should replace process env NODE_ENV with string literal"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                files: {
                    "index.ts": `exports.env = process.env["NODE_ENV"]`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("exports.env = 'production'");
        });
    }

    "Should replace process env (uknown variable to undefined)"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                files: {
                    "index.ts": `exports.env = process.env.LOL`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("exports.env = undefined");
        });
    }

    "Should replace process env.foo"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                plugins: [EnvPlugin({ foo: "foo" })],
                files: {
                    "index.ts": `exports.env = process.env.foo`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("exports.env = 'foo'");
        });
    }

    "Should console log process.env.foo"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                plugins: [EnvPlugin({ foo: "foo" })],
                files: {
                    "index.ts": `console.log(process.env.foo)`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).findString("console.log('foo')");
        });
    }

    "Should replace env in the fn call"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false,
            },
            project: {
                plugins: [EnvPlugin({ foo: "foo" })],
                files: {
                    "index.ts": `

                        const hello = function(id, info){
                            return info
                        }
                        hello(1, process.env.foo)
                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("hello(1, 'foo')");
        });
    }

}
