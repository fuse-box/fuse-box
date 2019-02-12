import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("GlobalsTest", () => {
	it("Should expose globals (all *) for browser", () => {
		return createOptimisedBundleEnv({
			options: {
				target: "browser",
			},
			project: {
				files: {
					"index.js": `exports.something = "hello"`,
				},
				globals: { default: "*" },
				instructions: "> index.js",
			},
		}).then(result => {
			expect(result.window.something).toEqual("hello");
		});
	});

	it("Should expose globals (by name) for browser", () => {
		return createOptimisedBundleEnv({
			options: {
				target: "browser",
			},
			project: {
				files: {
					"index.js": `exports.something = "hello"`,
				},
				globals: { default: "stuff" },
				instructions: "> index.js",
			},
		}).then(result => {
			expect(result.window.stuff).toEqual({ something: "hello" });
		});
	});

	it("Should expose globals to server", () => {
		return createOptimisedBundleEnv({
			options: {
				target: "server",
				bakeAPI: "index.js",
			},
			project: {
				files: {
					"index.js": `exports.something = "hello"`,
				},
				globals: { default: "*" },
				instructions: "> index.js",
			},
		}).then(result => {
			expect(result.bundles[1]).toEqual({ something: "hello" });
		});
	});
});
