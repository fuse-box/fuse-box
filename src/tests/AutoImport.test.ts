import { createEnv } from "./stubs/TestEnvironment";
import { should } from "fuse-test-runner";

export class AutoImportTest {
    "Should inject a variable woops case 1"() {
        return createEnv({
            modules: {
                superFoo: {
                    files: {
                        "index.ts": `export const HelloFoo = "I am super"`,
                    },
                    package: "superFoo",
                    instructions: ">index.ts",
                },
            },
            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `exports.something = woops`,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();

            should(contents).findString(`/* fuse:injection: */ var woops`);
            should(out).deepEqual({ something: { HelloFoo: "I am super" } });
        });
    }

    "Should inject a variable woops case 4"() {
        return createEnv({
            modules: {
                superFoo: {
                    files: {
                        "index.ts": `export const HelloFoo = {someAction : () => "here"}`,
                    },
                    package: "superFoo",
                    instructions: ">index.ts",
                },
            },
            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `exports.something = woops.HelloFoo.someAction()`,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();

            should(contents).findString(`/* fuse:injection: */ var woops`);
            should(out).deepEqual({ something: "here" });
        });
    }

    "Should inject a variable woops case 2"() {
        return createEnv({
            modules: {
                superFoo: {
                    files: {
                        "index.ts": `export const HelloFoo = "I am super"`,
                    },
                    package: "superFoo",
                    instructions: ">index.ts",
                },
            },
            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                        var coo = woops;
                        exports.something = coo;
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();

            should(contents).findString(`/* fuse:injection: */ var woops`);
            should(out).deepEqual({ something: { HelloFoo: "I am super" } });
        });
    }

    "Should not inject a variable woops case 1"() {

        return createEnv({
            modules: {
                superFoo2: {
                    files: {
                        "index.ts": `export const HelloFoo = "I am super"`,
                    },
                    package: "superFoo2",
                    instructions: ">index.ts",
                },
            },
            project: {
                autoImport: {
                    woops: "superFoo2",
                },
                files: {
                    "index.ts": `

                        var woops = {nada : true}
                        exports.myExport = woops;
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();
            should(contents).notFindString(`/* fuse:injection: */ var woops`);
            should(out).deepEqual({ myExport: { nada: true } });
        });
    }

    "Should inject a variable Inferno"() {

        return createEnv({
            modules: {
                inferno: {
                    files: {
                        "index.ts": `
                            export function magic(){
                                return "pure magic"
                            }
                        `,
                    },
                    package: "Inferno",
                    instructions: ">index.ts",
                },
            },
            project: {
                autoImport: {
                    Inferno: "inferno",
                },
                files: {
                    "index.ts": `exports.result = Inferno.magic()`,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();

            should(contents).findString(`/* fuse:injection: */ var Inferno`);
            should(out).deepEqual({ result: "pure magic" });
        });
    }

    "`Should auto import Buffer`"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": ` exports.hello = new Buffer("sd");
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();

            should(out.hello).beObject();
            should(contents).findString(`/* fuse:injection: */ var Buffer = require("buffer").Buffer`);
        });
    }

    "Process check with function"() {
        return createEnv({

            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                        function process(node) {

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

    "Process check with type property"() {
        return createEnv({

            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                        var a ={ process : "sdf"}
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {

            const contents = result.projectContents.toString();

            should(contents).notFindString(`/* fuse:injection: */ var process`);
        });
    }

    "Process check with function param 'function(process){}'"() {

        return createEnv({

            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                        var a = function(process){}
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {

            const contents = result.projectContents.toString();
            should(contents).notFindString(`/* fuse:injection: */ var process`);
        });
    }

    "Should not bundle process with 'function Users(process)'"() {

        return createEnv({

            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                       function Users(process){}
                    `,
                },
                instructions: "> index.ts",
            },
        }).then((result) => {

            const contents = result.projectContents.toString();
            should(contents).notFindString(`/* fuse:injection: */ var process`);
        });
    }

    "Should not bundle process with 'hello.process()'"() {

        return createEnv({

            project: {
                autoImport: {
                    woops: "superFoo",
                },
                files: {
                    "index.ts": `
                        var hello = { }
                        var a = () => {
                            return hello.process();
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

    "Should export process"() {

        return createEnv({

            project: {
                files: {
                    "index.ts": `
                       module.exports = {
                           hello : process
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
}
