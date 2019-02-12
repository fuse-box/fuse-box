import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
import { createEnv } from "../_helpers/OldEnv";
import { Babel7Plugin } from "../../src";

const babelPlugin = "./tests/plugins/Babel7PluginConfig/plugin-test.js";
describe("Babel7PluginTest", () => {
	it("Should bundle loading .babelrc implicitly (lookup for config)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					".babelrc": `{ "plugins": ["${babelPlugin}"] }`,
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
					expect(typeof imported.IwasTranspiledWithBabel).toBe("function");
					expect(imported.IwasTranspiledWithBabel.name).toEqual("IwasTranspiledWithBabel");
				}),
			);
	});

	it("Should bundle loading babel.config.js implicitly (lookup for config)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"babel.config.js": `
						module.exports = {
							"plugins": ["${babelPlugin}"]
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
					expect(typeof imported.IwasTranspiledWithBabel).toBe("function");
					expect(imported.IwasTranspiledWithBabel.name).toEqual("IwasTranspiledWithBabel");
				}),
			);
	});

	it("Should bundle with default if no config file found", () => {
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
					expect(imported.fn).toBeTruthy();
					expect(imported.fn.name).toEqual("fn");
				}),
			);
	});

	it("Should bundle loading .babelrc explicitely ('configFile' provided)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"config/.babelrc": `{ "plugins": ["${babelPlugin}"] }`,
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
					expect(typeof imported.IwasTranspiledWithBabel).toBe("function");
					expect(imported.IwasTranspiledWithBabel.name).toEqual("IwasTranspiledWithBabel");
				}),
			);
	});

	it("Should bundle loading babel.config.js explicitely ('configFile' provided)", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"config/babel.config.js": `
						module.exports = {
							"plugins": ["${babelPlugin}"]
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
					expect(typeof imported.IwasTranspiledWithBabel).toBe("function");
					expect(imported.IwasTranspiledWithBabel.name).toEqual("IwasTranspiledWithBabel");
				}),
			);
	});

	it("Should pass 'filename' to plugin", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"babel.config.js": `
						module.exports = {
							"plugins": ["${babelPlugin}"]
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
					expect(imported.file1).toContain("/qwerty.js");
					expect(imported.file2).toContain("/asdfgh.js");
				}),
			);
	});

	it("Should bundle wxyz with Babel using extensions", () => {
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
			expect(out).toEqual({ canada: { result: "igloo" } });
		});
	});

	it("Should allow extension overrides", () => {
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
					expect(window.FuseBox.import("./index").getMessage()).toEqual("I should be included");
				}),
			);
	});

	it("Should allow extension overrides with custom extensions", () => {
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
					expect(window.FuseBox.import("./index.wxyz").getMessage()).toEqual("I should be included");
				}),
			);
	});
	it("Should resolve injected imports/requires to polyfills from @babel/preset-env", () => {
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
					expect(window.FuseBox.import("./index.js").promise._v).toEqual("core-js/es6.promise.js added _v");
				}),
			);
	});
});
