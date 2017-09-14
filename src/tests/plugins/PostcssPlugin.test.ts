import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { PostCSS } from "../../plugins/stylesheet/PostCSSPlugin";

export class PostcssPluginTest {
    "Should import compiled postcss code"() {
        return createEnv({
            project: {
                files: {
                    "index.ts": `exports.hello = { bar : require("./style.css") }`,
                    "style.css": `
				body {
					color: white
        }
			`
                },
                plugins: [[PostCSS(), CSSPlugin({})]],
                instructions: "index.ts",
            },
        }).then((result) => {
            const out = result.projectContents.toString();
            should(out).findString(`color: white`);
        });
    }
}
