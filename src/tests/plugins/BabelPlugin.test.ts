import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";
import { BabelPlugin } from "../../plugins/js-transpilers/BabelPlugin";

export class BabelPluginTest {
	"Should bundle wxyz with Babel using extensions"() {
		return createEnv({
			project: {
				files: {
					"index.wxyz": `export {default as canada} from './moose/eh/igloo.wxyz'`,
					"moose/eh/igloo.wxyz": "export default { result: 'igloo'}",
				},
				instructions: "index.wxyz",
				plugins: [BabelPlugin({ extensions: [".wxyz"], config: { presets: ["latest"] } })],
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./index.wxyz");
			should(out).deepEqual({ canada: { result: "igloo" } });
		});
	}

	"Should allow extension overrides"() {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.js"],
				plugins: [BabelPlugin({ config: { presets: ["latest"] } })],
				files: {
					"index.js": `export {getMessage} from './hello'`,
					"hello.js": `export function getMessage() { return 'I should not be included'; }`,
					"hello.foo.js": `export function getMessage() { return 'I should be included'; }`,
				},
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					should(window.FuseBox.import("./index").getMessage()).equal("I should be included");
				}),
			);
	}

	"Should allow extension overrides with custom extensions"() {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.wxyz"],
				plugins: [BabelPlugin({ extensions: [".wxyz"], config: { presets: ["latest"] } })],
				files: {
					"index.wxyz": `export {getMessage} from './hello.wxyz'`,
					"hello.wxyz": `export function getMessage() { return 'I should not be included'; }`,
					"hello.foo.wxyz": `export function getMessage() { return 'I should be included'; }`,
				},
			},
		})
			.simple("> index.wxyz")
			.then(env =>
				env.browser(window => {
					should(window.FuseBox.import("./index.wxyz").getMessage()).equal("I should be included");
				}),
			);
	}
}
