
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
}