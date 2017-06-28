import { should } from "fuse-test-runner";
import { createOptimisedBundleEnv } from "../../tests/stubs/TestEnvironment";

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
                    "index.ts": `if ( process.env.NODE_ENV !== "production") {
                        require("./dev")
                    }`,
                    "dev.ts": ``
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.contents["index.js"];
            console.log(contents);
            //should(contents).findString("Object.defineProperty(exports");
        });
    }

}
