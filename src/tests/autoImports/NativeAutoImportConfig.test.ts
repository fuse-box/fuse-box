import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class NativeAutoImportConfig {
    "Should bundle process because { process: true }"() {
        return createEnv({
            project: {
                natives: {
                    process: true
                },
                files: {
                    "index.ts": `
                        
                        module.exports = {
                            hello : process.env
                        }
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.projectContents.toString();
            should(contents).findString(`/* fuse:injection: */ var process`);
        });
    }

    "Should not bundle process because { process: false }"() {
        return createEnv({
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        
                        module.exports = {
                            hello : process.env
                        }
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.projectContents.toString();
            should(contents).notFindString(`/* fuse:injection: */ var process`);
        });
    }

    "Should not bundle http because it's not set to false"() {
        return createEnv({
            project: {
                natives: {
                    process: false
                },
                files: {
                    "index.ts": `
                        
                        module.exports = {
                            hello : http
                        }
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const contents = result.projectContents.toString();
            should(contents).findString(`/* fuse:injection: */ var http`);
        });
    }
}