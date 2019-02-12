import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("RemoveStrictTest", () => {
	it("should keep intreop mode in a bundle", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				files: {
					"index.ts": `export class Hello {}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).toContain("Object.defineProperty(exports");
		});
	});

	it("should remove intreop mode in a bundle", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: true,
			},
			project: {
				files: {
					"index.ts": `export class Hello {}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).not.toContain("Object.defineProperty(exports");
		});
	});
});
