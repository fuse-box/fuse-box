import { should } from "fuse-test-runner";
import { createEnv } from "../stubs/TestEnvironment";
import { UglifyESPlugin } from "../../plugins/UglifyESPlugin";

export class UglifyESPluginTest {
    "Should return compressed js 1"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `
                const longVar = 'str1';
                let longVar2 = 'str2';
                module.exports = () => { return longVar + ' ' + longVar2; }
                `,
                },
                plugins: [UglifyESPlugin()],
                instructions: ">index.ts",
            },
        }).then((result) => {
            result.project.FuseBox.import("./index");
            const contents = result.projectContents.toString();
            should(contents).findString("str1 str2");
        });
    }

    "Should return __compressed__ js 2"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `
                    const longVar = 'str1';
                    let longVar2 = 'str2';
                    module.exports = () => { return longVar + ' ' + longVar2; }
                  `,
                },
                globals: { default: "__compressed__" },
                plugins: [UglifyESPlugin()],
                instructions: ">index.ts",
            },
        }).then((result) => {
            result.project.FuseBox.import("./index");
            should(("__compressed__" in result.project)).beTrue();
            should(result.project.__compressed__()).findString("str1 str2");
        });
    }
}
