import * as appRoot from "app-root-path";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import { should } from "fuse-test-runner";
import * as path from "path";
import { CSSPlugin } from "../../plugins/stylesheet/CSSplugin";
import { CSSResourcePlugin } from "../../plugins/stylesheet/CSSResourcePlugin";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { createEnv } from "./../stubs/TestEnvironment";

let tmp, shouldExist;

const makeTestFolder = () => {
	tmp = path.join(appRoot.path, ".fusebox", "css-test", new Date().getTime().toString());
	fsExtra.ensureDirSync(tmp);
	shouldExist = name => {
		const fname = path.join(tmp, name);
		should(fs.existsSync(fname)).equal(true);
		return fs.readFileSync(fname).toString();
	};
};

export class CssPluginTest {
	"Should require and inline a simple CSS File"() {
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
			should(js).findString(`require("fuse-box-css")("default/main.css", "body {}")`);
		});
	}

	"A simple case should with the the CSSResourcePlugin"() {
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
			should(js).findString(`require("fuse-box-css")("default/main.css", "body {}")`);
		});
	}

	"Should allow overrides of .css extensions"() {
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
					should(window.document.querySelectorAll("style")).haveLength(1);
					should(window.document.querySelector("style").attributes.id.value).equal("default-main-css");
					should(window.document.querySelector("style").innerHTML).equal("html { background: blue; }");
				}),
			);
	}
}
