import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
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
			`,
				},
				plugins: [[StylusPlugin({}), CSSPlugin({})]],
				instructions: "index.ts",
			},
		}).then(result => {
			const out = result.projectContents.toString();
			should(out).findString(`color: #fff`);
		});
	}

	"Should allow extension overrides"() {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.styl"],
				plugins: [[StylusPlugin({}), CSSPlugin({})]],
				files: {
					"index.ts": `import "./main.styl";`,
					"main.styl": `
              body
                color red
              `,
					"main.foo.styl": `
              body
                color blue
              `,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					should(window.document.querySelectorAll("style")).haveLength(1);
					should(window.document.querySelector("style").attributes.id.value).equal("default-main-styl");
					should(window.document.querySelector("style").innerHTML).findString("color: #00f;");
				}),
			);
	}
}
