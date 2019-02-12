import * as appRoot from "app-root-path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { CSSPlugin, CSSResourcePlugin } from "../../src";
import { createEnv } from "../_helpers/OldEnv";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
let tmp, shouldExist;

const makeTestFolder = () => {
	tmp = path.join(appRoot.path, ".fusebox", "css-test", new Date().getTime().toString());
	fsExtra.ensureDirSync(tmp);
	shouldExist = name => {
		const fname = path.join(tmp, name);
		expect(fs.existsSync(fname)).toEqual(true);
		return fs.readFileSync(fname).toString();
	};
};

describe("CssPluginTest", () => {
	it("Should require and inline a simple CSS File", () => {
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./main.css") }`,
					"main.css": "body {}",
				},
				plugins: [CSSPlugin()],
				instructions: "> index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();
			expect(js).toContain(`require("fuse-box-css")("default/main.css", "body {}")`);
		});
	});

	it("A simple case should with the the CSSResourcePlugin", () => {
		makeTestFolder();
		return createEnv({
			project: {
				files: {
					"index.ts": `exports.hello = { bar : require("./main.css") }`,
					"main.css": "body {}",
				},
				plugins: [[CSSResourcePlugin({ inline: true }), CSSPlugin()]],
				instructions: "> index.ts",
			},
		}).then(result => {
			const js = result.projectContents.toString();
			expect(js).toContain(`require("fuse-box-css")("default/main.css", "body {}")`);
		});
	});

	it("Should allow overrides of .css extensions", () => {
		return FuseTestEnv.create({
			project: {
				plugins: [CSSPlugin()],
				extensionOverrides: [".foo.css"],
				files: {
					"index.ts": `import './main.css'`,
					"main.css": `html { background: red; }`,
					"main.foo.css": `html { background: blue; }`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.document.querySelectorAll("style")).toHaveLength(1);
					expect(window.document.querySelector("style").attributes.id.value).toEqual("default-main-css");
					expect(window.document.querySelector("style").innerHTML).toEqual("html { background: blue; }");
				}),
			);
	});
});
