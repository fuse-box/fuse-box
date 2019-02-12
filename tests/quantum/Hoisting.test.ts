import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("TreeShakeTest", () => {
	it("Should not hoist", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				hoisting: true,
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
					"reflux.ts": `

                    `,
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("var Reflux = $fsx.r(1);\nReflux.createAction();");
		});
	});

	it("Should hoist cuz of 2 mentions", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				hoisting: true,
				treeshake: true,
			},
			project: {
				files: {
					"index.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
					"some.ts": `
                        var Reflux = require("./reflux");
                        Reflux.createAction();
                    `,
					"reflux.ts": `

                    `,
				},
				instructions: "**/**.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("var Reflux = $fsx.r(1);\n})($fsx);");
		});
	});
});
