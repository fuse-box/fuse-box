import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { JSONPlugin } from "../../plugins/JSONplugin";

export class JSONPluginTest {
    "Should import JSON file as object"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `const json= require('./config.json');`,
                    "config.json": `{
                    "name":"test",
                    "tags":["fusebox","test"]
                    }`,
                },
                plugins: [JSONPlugin()],
                instructions: "> index.ts",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./config.json");
            should(out).deepEqual({ "name": "test", "tags": ["fusebox", "test"] }
            );
        });
    }
}
