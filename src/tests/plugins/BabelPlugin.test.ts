import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { BabelPlugin } from "../../plugins/js-transpilers/BabelPlugin";

export class BabelPluginTest {
    "Should bundle wxyz with Babel using extensions"() {
        return createEnv({
            project: {
                files: {
                    "index.wxyz": `export {default as canada} from './moose/eh/igloo.wxyz'`,
                    "moose/eh/igloo.wxyz": "export default { result: 'igloo'}",
                },
                instructions: "index.wxyz",
                plugins: [BabelPlugin({ extensions: [".wxyz"], config: { "presets": ["latest"] } })],
            },
        }).then((result) => {
          const out = result.project.FuseBox.import("./index.wxyz");
          should(out).deepEqual({ canada: { result: "igloo" } });
        });
    }
}
