import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("RemoveProcess", () => {
	it("Should replace process with undefined", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
	                 if ( process ) {
	                     console.log("hello")
					 }
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("process");
			expect(contents).toContain("undefined");
		});
	});

	it("Should not process with undefined", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
					 var process = {};
	                 if ( process ) {
	                     console.log("hello")
					 }
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("if (process) {");
		});
	});

	it("Should replace process.version with a string", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
					 	var version = process.version;
					`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain(`var process = { version : "" };`);
		});
	});
});
