import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class ShimBundleTest {
    "Should create a separate bundle with shims"() {
        return createOptimisedBundleEnv({
            project: {
                shim: {
                    dirty: {
                        source: "src/tests/stubs/test_modules/foo/index.js",
                        exports: "window.fooLibrary"
                    }
                },
                files: {
                    "index.js": `exports.something = require("dirty")`
                },
                globals: { "default": "*" },

                instructions: "> index.js",
            },
        }).then(result => {
            should(result.window.something).deepEqual(result.window.something);

            should(result.contents["shims.js"]).beOkay();
        });
    }
}
