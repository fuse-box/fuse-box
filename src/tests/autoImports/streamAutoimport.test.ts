
import { should } from "fuse-test-runner";
import { createEnv } from "../stubs/TestEnvironment";

export class StreamAutoImportTest {
    "Should inject stream test 1"() {
        return createEnv({
            project: {

                files: {
                    "index.ts": `var myStream = stream;
                    
                        module.exports = {
                            hello : myStream
                        }
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.projectContents.toString();
            should(contents).findString(`/* fuse:injection: */ var stream`);
        });
    }

    "Should inject stream test 2"() {
        return createEnv({
            project: {

                files: {
                    "index.ts": `
                        module.exports = {
                            hello : stream
                        }
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.projectContents.toString();
            should(contents).findString(`/* fuse:injection: */ var stream`);
        });
    }
}
