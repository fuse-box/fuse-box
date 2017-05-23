import { createOptimisedBundleEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class RemoveStrictTest {
    "should keep intreop mode in a bundle"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: false
            },
            project: {
                files: {
                    "index.ts": `export class Hello {}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).findString("Object.defineProperty(exports");
        });
    }

    "should remove intreop mode in a bundle"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {
                removeExportsInterop: true
            },
            project: {
                files: {
                    "index.ts": `export class Hello {}`
                },
                instructions: "index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];

            should(contents).notFindString("Object.defineProperty(exports");
        });
    }

    "should remove intreop mode in a bundle by default"() {
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

            should(contents).notFindString("Object.defineProperty(exports");
        });
    }
}