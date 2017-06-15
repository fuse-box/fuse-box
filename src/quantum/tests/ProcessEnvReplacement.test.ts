
import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

export class ProcessEnvReplacement {
    "Should replace process env"() {
        return createOptimisedBundleEnv({
            stubs: true,
            options: {

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
}
