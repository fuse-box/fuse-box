import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";


export class ServerEnvironmentConditionTest {
    "Should handle FuseBox.isServer"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = FuseBox.isServer`
                },
                instructions: "> index.js",
            },
        }).then((result) => {

            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: false });
        });
    }

    "Should handle FuseBox.isBrowser"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = FuseBox.isBrowser`
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);

            should(first).deepEqual({ something: true });
        });
    }

    "Should handle  isServer in a list"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = [FuseBox.isServer]`
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: [false] });
        });
    }
    "Should handle  isServer and isBrowser in a list"() {
        // gets a module from src/tests/stubs/test_modules/fbjs
        return createOptimisedBundleEnv({
            stubs: true,
            project: {
                files: {
                    "index.js": `exports.something = [FuseBox.isServer, FuseBox.isBrowser]`
                },
                instructions: "index.js",
            },
        }).then((result) => {

            const first = result.window.$fsx.r(0);
            should(first).deepEqual({ something: [false, true] });
        });
    }

}