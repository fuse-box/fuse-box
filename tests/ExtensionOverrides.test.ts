import { ExtensionOverrides } from "../src/core/ExtensionOverrides";
import { createRealNodeModule, FuseTestEnv } from "./_helpers/stubs/FuseTestEnv";

describe("ExtensionOverridesTest", () => {
	it("Should create an instance and set overrides if they are valid", () => {
		const extensionOverrides = new ExtensionOverrides([".foo.ts", ".foo.css"]);

		expect(extensionOverrides.overrides).toEqual([".foo.ts", ".foo.css"]);
	});

	it("Should create an instance and not set overrides if they are invalid", () => {
		const extensionOverrides = new ExtensionOverrides(["not-valid.ts", ".foo.css"]);

		expect(extensionOverrides.overrides).toEqual([".foo.css"]);
	});

	it("Should allow adding additional overrides", () => {
		const extensionOverrides = new ExtensionOverrides([".foo.ts"]);

		expect(extensionOverrides.overrides).toEqual([".foo.ts"]);

		extensionOverrides.add(".foo.css");

		expect(extensionOverrides.overrides).toEqual([".foo.ts", ".foo.css"]);
	});

	it("Should not update a File's path info if the file does not belong to the project", () => {
		const name = "fuse_test_a";

		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				main: "./index.js",
			}),
			"index.js": `module.exports = require("./target.js")`,
			"target.js": `module.exports = {message : "I should be included"}`,
			"target.foo.js": `module.exports = {message : "I should not be included"}`,
		});

		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.ts"],
				files: {
					"index.ts": `module.exports = require("${name}")`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./index")).toEqual({ message: "I should be included" });
				}),
			);
	});

	it("Should update a File's path info if an override matches", () => {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.ts"],
				files: {
					"index.ts": `export {getMessage} from './hello'`,
					"hello.ts": `export function getMessage() { return 'I should not be included'; }`,
					"hello.foo.ts": `export function getMessage() { return 'I should be included'; }`,
				},
			},
		})
			.simple()
			.then(env =>
				env.browser(window => {
					expect(window.FuseBox.import("./index").getMessage()).toEqual("I should be included");
				}),
			);
	});
});
