import { MarkdownPlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";

describe("MarkdownPluginTest", () => {
	it("Should get Template with Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.md');`,
					"index.md": `# hello`,
				},
				plugins: [MarkdownPlugin()],
				instructions: "> index.ts **/*.md",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`module.exports.default =  "<h1 id=\\"hello\\">hello</h1>\\n"`);
		});
	});

	it("Should get Template without Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.md');`,
					"index.md": `# hello`,
				},
				plugins: [MarkdownPlugin({ useDefault: false })],
				instructions: "> index.ts **/*.md",
			},
		}).then(result => {
			const contents = result.projectContents.toString();
			expect(contents).toContain(`module.exports =  "<h1 id=\\"hello\\">hello</h1>\\n"`);
		});
	});

	it("Should import template with Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.md');`,
					"index.md": `# hello`,
				},
				plugins: [MarkdownPlugin()],
				instructions: "> index.ts **/*.md",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index.md");
			expect(out).toEqual({
				default: '<h1 id="hello">hello</h1>\n',
			});
		});
	});

	it("Should import template without Default as export", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `const template= require('./index.md');`,
					"index.md": `# hello`,
				},
				plugins: [MarkdownPlugin({ useDefault: false })],
				instructions: "> index.ts **/*.md",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index.md");
			expect(out).toEqual('<h1 id="hello">hello</h1>\n');
		});
	});

	it("Should allow extension overrides", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.md"],
				plugins: [MarkdownPlugin({ useDefault: false })],
				files: {
					"file.md": `# I should not be included`,
					"file.foo.md": `# I should be included`,
				},
			},
		})
			.simple(">file.md")
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./file.md")).toEqual(
						'<h1 id="i-should-be-included">I should be included</h1>\n',
					);
				}),
			);
	});
});
