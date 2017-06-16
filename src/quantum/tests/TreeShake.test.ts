import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class TreeShakeTest {
    "Should not tree shake Foo2"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: false
            },
            project: {
                files: {
                    "index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString(`exports.Foo2`);

        });
    }

    "Should tree shake Foo2"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.ts": `
                        import { Foo1 } from "./foo";
                        console.log(Foo1);
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString(`exports.Foo2`);

        });
    }

    "Should not shake an imidiate require"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                treeshake: true
            },
            project: {
                files: {
                    "index.js": `
                        require('./bar');
                    `,
                    "foo.ts": `
                        class Foo1 {}
                        class Foo2 {}
                        exports.Foo1 = Foo1;
                        exports.Foo2 = Foo2;

                    `
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            console.log(contents);
            //should(contents).notFindString(`exports.Foo2`);

        });
    }

}
