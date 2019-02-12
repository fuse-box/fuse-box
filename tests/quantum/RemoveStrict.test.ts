import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("RemoveStrictTest", () => {
	it("should keep strict mode in a bundle", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeUseStrict: false,
			},
			project: {
				files: {
					"index.ts": `export class Hello {}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("use strict");
		});
	});

	it("should remove strict mode in a bundle with option", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeUseStrict: true,
			},
			project: {
				files: {
					"index.ts": `export class Hello {}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("use strict");
		});
	});
	it("should remove strict mode in a bundle by default", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {},
			project: {
				files: {
					"index.ts": `export class Hello {}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("use strict");
		});
	});
});
