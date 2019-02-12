import { CSSPlugin, StylusPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
describe("StylusPluginTest", () => {
	it("Should import compiled css code", () => {
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
			expect(out).toContain(`color: #fff`);
		});
	});

	it("Should allow extension overrides", () => {
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
					expect(window.document.querySelectorAll("style")).toHaveLength(1);
					expect(window.document.querySelector("style").attributes.id.value).toEqual("default-main-styl");
					expect(window.document.querySelector("style").innerHTML).toContain("color: #00f;");
				}),
			);
	});
});
