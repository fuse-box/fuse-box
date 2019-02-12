import { HTMLPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("HtmlPluginTest", () => {
	it("Should get Template with Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.html');`,
					"index.html": `<h1>hello</h1>`,
				},
				plugins: [HTMLPlugin()],
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`module.exports.default =  "<h1>hello</h1>"`);
		});
	});

	it("Should get Template without Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.html');`,
					"index.html": `<h1>hello</h1>`,
				},
				plugins: [HTMLPlugin({ useDefault: false })],
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`module.exports =  "<h1>hello</h1>"`);
		});
	});

	it("Should import template with Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.html');`,
					"index.html": `<h1>hello</h1>`,
				},
				plugins: [HTMLPlugin()],
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index.html");
			expect(out).toEqual({
				default: "<h1>hello</h1>",
			});
		});
	});

	it("Should import template without Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.html');`,
					"index.html": `<h1>hello</h1>`,
				},
				plugins: [HTMLPlugin({ useDefault: false })],
				instructions: "> index.ts",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index.html");
			expect(out).toEqual("<h1>hello</h1>");
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.html"],
				plugins: [HTMLPlugin({ useDefault: false })],
				files: {
					"index.ts": `const template = require('./index.html');`,
					"index.html": `<h1>I should not be included</h1>`,
					"index.foo.html": `<h1>I should be included</h1>`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./index.html")).toEqual("<h1>I should be included</h1>");
				}),
			);
	});
});
