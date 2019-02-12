import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";
import * as appRoot from "app-root-path";
import * as path from "path";
describe("ShimBundleTest", () => {
	it("Should create a separate bundle with shims", () => {
		return createOptimisedBundleEnv({
			project: {
				shim: {
					dirty: {
						source: path.join(appRoot.path, "tests/_helpers/stubs/test_modules/foo/index.js"),
						exports: "window.fooLibrary",
					},
				},
				files: {
					"index.js": `exports.something = require("dirty")`,
				},
				globals: { default: "*" },

				instructions: "> index.js",
			},
		}).then(result => {
			expect(result.window.something).toEqual(result.window.something);

			expect(result.contents["shims.js"]).toBeTruthy();
		});
	});
});
