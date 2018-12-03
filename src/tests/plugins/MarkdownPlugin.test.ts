import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";
import { MarkdownPlugin } from "../../plugins/Markdownplugin";

export class MarkdownPluginTest {
	"Should get Template with Default as export"() {
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
			should(contents).findString(`module.exports.default =  "<h1 id=\\"hello\\">hello</h1>\\n"`);
		});
	}

	"Should get Template without Default as export"() {
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
			should(contents).findString(`module.exports =  "<h1 id=\\"hello\\">hello</h1>\\n"`);
		});
	}

	"Should import template with Default as export"() {
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
			should(out).deepEqual({
				default: '<h1 id="hello">hello</h1>\n',
			});
		});
	}

	"Should import template without Default as export"() {
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
			should(out).equal('<h1 id="hello">hello</h1>\n');
		});
	}

	"Should allow extension overrides"() {
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
					should(window.FuseBox.import("./file.md")).deepEqual(
						'<h1 id="i-should-be-included">I should be included</h1>\n',
					);
				}),
			);
	}
}
