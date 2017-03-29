import { createEnv } from "./../stubs/TestEnvironment";
import { AssetsPlugin } from "../../plugins/AssetsPlugin";
import { should } from "fuse-test-runner";



export class CssPluginTest {
    /** DEV (easy hashing) */

    "Should copy a file (dev)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/406baab1-hello.txt")

            should(result.projectContents.toString())
                .findString(`module.exports.default = "/assets/406baab1-hello.txt";`);
        });
    }

    "Should copy a file to some place else (dev)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ dest: "static-files", files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("static-files/406baab1-hello.txt")

            should(result.projectContents.toString())
                .findString(`module.exports.default = "/assets/406baab1-hello.txt";`);
        });
    }

    "Should copy a file and ignore default (dev)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ useDefault: false, files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/406baab1-hello.txt")
            should(result.projectContents.toString())
                .findString(`module.exports = "/assets/406baab1-hello.txt";`);
        });
    }

    "Should copy a file with custom resolver (dev)"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"
                },
                plugins: [AssetsPlugin({ resolve: "/static/", files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/406baab1-hello.txt")
            should(result.projectContents.toString())
                .findString(`module.exports.default = "/static/406baab1-hello.txt";`);
        });
    }



    /** PRODUCTION (real hashing) */

    "Should copy a file (hash)"() {
        return createEnv({

            project: {
                hash: true,
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/92849cf0-hello.txt")
            should(result.projectContents.toString())
                .findString(`module.exports.default = "/assets/92849cf0-hello.txt";`);
        });
    }


    "Should copy a file to some place else (hash)"() {
        return createEnv({
            project: {
                hash: true,
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ dest: "static-files", files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("static-files/92849cf0-hello.txt")

            should(result.projectContents.toString())
                .findString(`module.exports.default = "/assets/92849cf0-hello.txt";`);
        });
    }

    "Should copy a file and ignore default (hash)"() {
        return createEnv({
            project: {
                hash: true,
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"

                },
                plugins: [AssetsPlugin({ useDefault: false, files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/92849cf0-hello.txt")
            should(result.projectContents.toString())
                .findString(`module.exports = "/assets/92849cf0-hello.txt";`);
        });
    }

    "Should copy a file with custom resolver (hash)"() {
        return createEnv({
            project: {
                hash: true,
                files: {
                    "index.ts": `require("./hello.txt")`,
                    "hello.txt": "ololo"
                },
                plugins: [AssetsPlugin({ resolve: "/static/", files: [".txt"] })],
                instructions: "> index.ts",
            },
        }).then((result) => {
            result.shouldExistInDist("assets/92849cf0-hello.txt")
            should(result.projectContents.toString())
                .findString(`module.exports.default = "/static/92849cf0-hello.txt";`);
        });
    }
}
