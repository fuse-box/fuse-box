import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";
import { EnvPlugin } from "../../index";

export class RemoveStrictTest {
    "Should not bundle dead code"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                    if ( process.env.NODE_ENV !== "production") {
                        console.log("hello")
                    }`,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            console.log(contents);
            should(contents).notFindString('hello');
        });
    }

    "Should not bundle dead code with process.env['NODE_ENV']"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                    if ( process.env["NODE_ENV"] !== "production") {
                        console.log("hello")
                    }`,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('hello');
        });
    }

    "Should not bundle with undefined value"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                    if ( process.env.FOO !== undefined) {
                        console.log("hello")
                    }`,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {

            const contents = result.contents["index.js"];
            should(contents).notFindString('hello');
        });
    }

    "Should unwrap condition"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                    if ( process.env.NODE_ENV === "production") {
                        console.log("production")
                    }`,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString('production');
        });
    }
    "Should bundle alternative code / opposite of false"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        if ( process.env.NODE_ENV !== "production") {
                            require("./dev")
                        } else {
                            console.log("hello")
                        }

                    `,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('if');
            should(contents).findString('hello');
        });
    }

    "Should bundle consequent code / opposite of true"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        if ( process.env.NODE_ENV === "production") {
                            console.log("production")
                        } else {
                            console.log("development")
                        }

                    `,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString('development');
            should(contents).findString('production');
        });
    }

    "Should not bundle unrelated module"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true,
                removeExportsInterop: false
            },
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        if ( process.env.NODE_ENV !== "production") {
                            require("./dev")
                        } else {
                            console.log("development")
                        }

                    `,
                    "dev.ts": `console.log("i am dev")`
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString("i am dev");
        });
    }


    "Should not bundle dead code on a custom process.env variable"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                plugins: [EnvPlugin({ foo: "eh" })],
                files: {
                    "index.ts": `

                    if ( process.env.foo === "bar") {
                        console.log("hello")
                    }

                    `,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).notFindString('hello');
        });
    }

    "Should bundle alternate code on a custom process.env variable"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                plugins: [EnvPlugin({ foo: "eh" })],
                files: {
                    "index.ts": `

                    if ( process.env.foo === "bar") {
                        console.log("wrong")
                    } else {
                        console.log("correct")
                    }

                    `,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).notFindString('wrong');
            should(contents).findString('correct');
        });
    }

    "Should remove double mention in dev env"() {

        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true,
                removeExportsInterop: false
            },
            project: {
                plugins: [EnvPlugin({ foo: "eh" })],
                files: {
                    "index.ts": `

                        if (process.env.NODE_ENV !== 'production') {
                            require("./dev2")
                            require("./dev")
                        }

                    `,
                    "some.ts": `
                        if (process.env.NODE_ENV !== 'production') {
                            require("./dev")
                        }
                    `,
                    "dev2.ts": ``,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];


        });
    }




}
