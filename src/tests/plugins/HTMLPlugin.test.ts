import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";
import { HTMLPlugin } from "../../plugins/HTMLplugin";

export class HtmlPluginTest {
	"Should get Template with Default as export"() {
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
			should(contents).findString(`module.exports.default =  "<h1>hello</h1>"`);
		});
	}

	"Should get Template without Default as export"() {
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
			should(contents).findString(`module.exports =  "<h1>hello</h1>"`);
		});
	}

	"Should import template with Default as export"() {
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
			should(out).deepEqual({
				default: "<h1>hello</h1>",
			});
		});
	}

	"Should import template without Default as export"() {
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
			should(out).equal("<h1>hello</h1>");
		});
	}

	"Should allow extension overrides"() {
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
					should(window.FuseBox.import("./index.html")).deepEqual("<h1>I should be included</h1>");
				}),
			);
	}
}
