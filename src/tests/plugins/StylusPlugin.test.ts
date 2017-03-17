import { createEnv } from "./../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { StylusPlugin } from "../../plugins/stylesheet/StylusPlugin";

export class StylusPluginTest {
    "Should import compiled css code"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./style.styl") }`,
                    "style.styl": `
				body
					color white
			`
                },
                plugins: [[StylusPlugin({}), CSSPlugin({})]],
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.projectContents.toString();
            should(out).findString(`color: #fff`);
        });
    }
}
