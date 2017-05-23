import { createEnv } from "./stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class EcmaScript6Test {
    "Should bundle with es6 code"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                        export { foo } from "./foo";
                    `,
                    "foo.js": `
                        export function foo(){return 1}
                    `
                },
                instructions: "**/*.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            should(fuse.import("./index.js").foo()).equal(1);
        });
    }

    "Should follow links on export"() {
        return createEnv({
            project: {
                files: {
                    "index.js": `
                        export { foo } from "./foo";
                    `,
                    "foo.js": `
                        export function foo(){return 1}
                    `
                },
                instructions: "index.js",
            },
        }).then((result) => {
            const fuse = result.project.FuseBox;
            should(fuse.import("./index.js").foo()).equal(1);
        });
    }


}
