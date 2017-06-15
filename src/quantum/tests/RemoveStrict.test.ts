import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class RemoveStrictTest {
    "should keep strict mode in a bundle"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeUseStrict: false
            },
            project: {
                files: {
                    "index.ts": `export class Hello {}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).findString("use strict");
        });
    }

    "should remove strict mode in a bundle with option"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeUseStrict: true
            },
            project: {
                files: {
                    "index.ts": `export class Hello {}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString("use strict");
        });
    }
    "should remove strict mode in a bundle by default"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {

            },
            project: {
                files: {
                    "index.ts": `export class Hello {}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            should(contents).notFindString("use strict");
        });
    }
}
