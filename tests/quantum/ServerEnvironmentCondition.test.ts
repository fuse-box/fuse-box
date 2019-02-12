import { QuantumPlugin } from "../../src";
import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("ServerEnvironmentConditionTest", () => {
	it("Should handle FuseBox.isServer", () => {
		// gets a module from src/tests/stubs/test_modules/fbjs
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.js": `exports.something = FuseBox.isServer`,
				},
				instructions: "> index.js",
			},
		}).then(result => {
			const first = result.window.$fsx.r(0);
			expect(first).toEqual({ something: false });
		});
	});

	it("Should handle FuseBox.isBrowser", () => {
		// gets a module from src/tests/stubs/test_modules/fbjs
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.js": `exports.something = FuseBox.isBrowser`,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const first = result.window.$fsx.r(0);

			expect(first).toEqual({ something: true });
		});
	});

	it("Should handle  isServer in a list", () => {
		// gets a module from src/tests/stubs/test_modules/fbjs
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.js": `exports.something = [FuseBox.isServer]`,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const first = result.window.$fsx.r(0);
			expect(first).toEqual({ something: [false] });
		});
	});
	it("Should handle  isServer and isBrowser in a list", () => {
		// gets a module from src/tests/stubs/test_modules/fbjs
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.js": `exports.something = [FuseBox.isServer, FuseBox.isBrowser]`,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const first = result.window.$fsx.r(0);
			expect(first).toEqual({ something: [false, true] });
		});
	});

	it("Should replace if statements (dead code)", () => {
		return createOptimisedBundleEnv({
			stubs: true,

			project: {
				files: {
					"index.js": `
                        if (FuseBox.isServer){
                            console.log("server")
                        }
                    `,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("server");
		});
	});

	it("Should replace if statements (dead code) -> alternate", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.js": `
                        if (FuseBox.isServer){
                            console.log("server")
                        } else {
                            console.log("browser")
                        }
                    `,
				},
				instructions: "index.js",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("server");
			expect(contents).toContain("browser");
		});
	});

	it("Should handlle universal target on server", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        module.exports = require("path").join('a')
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "universal",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("a");
					},
				),
			);
	});

	it("Should handlle FuseBox.target", () => {
		return FuseTestEnv.create({
			project: {
				files: {
					"index.ts": `
                        module.exports = FuseBox.target
                        `,
				},
				plugins: [
					QuantumPlugin({
						target: "electron",
					}),
				],
			},
		})
			.simple()
			.then(test =>
				test.server(
					`
                const index = $fsx.r(0);
                process.send({response : index})

            `,
					data => {
						expect(data.response).toEqual("electron");
					},
				),
			);
	});
});
