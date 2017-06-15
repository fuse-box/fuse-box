import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class GlobalsTest {
    "Should expose globals (all *) for browser"() {
        return createOptimisedBundleEnv({
            options: {
                target: "browser"
            },
            project: {
                files: {
                    "index.js": `exports.something = "hello"`
                },
                globals: { "default": "*" },
                instructions: "> index.js",
            },
        }).then((result) => {
            should(result.window.something).equal("hello");
        });
    }

    "Should expose globals (by name) for browser"() {
        return createOptimisedBundleEnv({
            options: {
                target: "browser"
            },
            project: {
                files: {
                    "index.js": `exports.something = "hello"`
                },
                globals: { "default": "stuff" },
                instructions: "> index.js",
            },
        }).then((result) => {
            should(result.window.stuff).deepEqual({ something: "hello" })
        });
    }


    "Should expose globals to server"() {
        return createOptimisedBundleEnv({
            options: {
                target: "server",
                bakeAPI: "index.js"
            },
            project: {
                files: {
                    "index.js": `exports.something = "hello"`
                },
                globals: { "default": "*" },
                instructions: "> index.js",
            },
        }).then(result => {
            should(result.bundles[1]).deepEqual({ something: 'hello' })
        });
    }


}
