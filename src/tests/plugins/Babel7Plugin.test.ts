import { createEnv } from "./../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";
import { Babel7Plugin } from "../../plugins/js-transpilers/Babel7Plugin";

export class Babel7PluginTest {
	"Should bundle loading .babelrc implicitly (lookup for config)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					".babelrc": `{ "plugins": ["./src/tests/plugins/Babel7PluginConfig/plugin-test.js"] }`,
					"index.js": `
						export function fn() {}
						console.log(fn("something"))
					`,
				},
				plugins: [Babel7Plugin({ extensions: [".js"] })],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.IwasTranspiledWithBabel).beFunction();
					should(imported.IwasTranspiledWithBabel.name).equal("IwasTranspiledWithBabel");
				}),
			);
	}
	"Should bundle loading babel.config.js implicitly (lookup for config)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"babel.config.js": `
						module.exports = {
							"plugins": ["./src/tests/plugins/Babel7PluginConfig/plugin-test.js"]
						}`,
					"index.js": `
						export function fn() {}
					`,
				},
				plugins: [Babel7Plugin({ extensions: [".js"] })],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.IwasTranspiledWithBabel).beFunction();
					should(imported.IwasTranspiledWithBabel.name).equal("IwasTranspiledWithBabel");
				}),
			);
	}
	"Should bundle with default if no config file found"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.js": `
						export function fn() {}
					`,
				},
				plugins: [Babel7Plugin({ extensions: [".js"] })],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.fn).beFunction();
					should(imported.fn.name).equal("fn");
				}),
			);
	}
	"Should bundle loading .babelrc explicitely ('configFile' provided)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"config/.babelrc": `{ "plugins": ["./src/tests/plugins/Babel7PluginConfig/plugin-test.js"] }`,
					"index.js": `
						export function fn() {}
					`,
				},
				plugins: [
					Babel7Plugin({
						extensions: [".js"],
						configFile: "./config/.babelrc",
					}),
				],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.IwasTranspiledWithBabel).beObject();
					should(imported.IwasTranspiledWithBabel.name).equal("IwasTranspiledWithBabel");
				}),
			);
	}
	"Should bundle loading babel.config.js explicitely ('configFile' provided)"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"config/babel.config.js": `
						module.exports = {
							"plugins": ["./src/tests/plugins/Babel7PluginConfig/plugin-test.js"]
						}`,
					"index.js": `
						export function fn() {}
					`,
				},
				plugins: [
					Babel7Plugin({
						extensions: [".js"],
						configFile: "./config/babel.config.js",
					}),
				],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.IwasTranspiledWithBabel).beObject();
					should(imported.IwasTranspiledWithBabel.name).equal("IwasTranspiledWithBabel");
				}),
			);
	}
	"Should pass 'filename' to plugin"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"babel.config.js": `
						module.exports = {
							"plugins": ["./src/tests/plugins/Babel7PluginConfig/plugin-test.js"]
						}`,
					"qwerty.js": `export default 'replaceWithFilename'`,
					"asdfgh.js": `export default 'replaceWithFilename'`,
					"index.js": `
						export { default as file1 } from './qwerty'
						export { default as file2 } from './asdfgh'
					`,
				},
				plugins: [Babel7Plugin({ extensions: [".js"] })],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					const imported = window.FuseBox.import("./index");
					should(imported.file1).findString("/qwerty.js");
					should(imported.file2).findString("/asdfgh.js");
				}),
			);
	}
	"Should bundle wxyz with Babel using extensions"() {
		return createEnv({
			project: {
				files: {
					"index.wxyz": `export {default as canada} from './moose/eh/igloo.wxyz'`,
					"moose/eh/igloo.wxyz": "export default { result: 'igloo'}",
				},
				instructions: "index.wxyz",
				plugins: [Babel7Plugin({ extensions: [".wxyz"], config: { presets: ["@babel/preset-env"] } })],
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
				plugins: [Babel7Plugin({ config: { presets: ["@babel/preset-env"] } })],
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
				plugins: [Babel7Plugin({ extensions: [".wxyz"], config: { presets: ["@babel/preset-env"] } })],
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
	"Should resolve injected imports/requires to polyfills from @babel/preset-env"() {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.js": `
						export const promise = Promise.resolve('core-js/es6.promise.js added _v')
					`,
				},
				plugins: [
					Babel7Plugin({
						config: {
							presets: [
								[
									"@babel/preset-env",
									{
										useBuiltIns: "usage",
										include: ["es6.promise"],
									},
								],
							],
						},
					}),
				],
			},
		})
			.simple("> index.js")
			.then(env =>
				env.browser(window => {
					should(window.FuseBox.import("./index.js").promise._v).equal("core-js/es6.promise.js added _v");
				}),
			);
	}
}
