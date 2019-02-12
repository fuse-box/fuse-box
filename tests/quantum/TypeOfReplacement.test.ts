import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("TypeOfReplacementTest", () => {
	it("should get rid of typeof module", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeUseStrict: false,
			},
			project: {
				files: {
					"index.ts": `module.exports = {result : typeof module === "object"}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).toContain("'object' === 'object'");
		});
	});
	it("should get rid of typeof exports", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `module.exports = {result : typeof exports === "object"}`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("'object' === 'object'");
		});
	});

	it("should replace typeof module", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `
                       function hello(){
                        if (typeof module === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("'object' === 'string'");
		});
	});

	it("should preserve typeof module in case of a local variable", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `
                       function hello(module){
                        if (typeof module === "string") {
                            return module;
                        }
                       }
                       module.exports.something = hello("123123")

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("typeof module === 'string'");
		});
	});

	it("should replace typeof global", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `
                       function hello(){
                        if (typeof global === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("'undefined' === 'string'");
		});
	});

	it("should not replace typeof global", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `
                       function hello(global){
                        if (typeof global === "string") {
                            return module;
                        }
                        return 1;
                       }
                       module.exports.something = hello("123123")

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("typeof global === 'string'");
		});
	});

	it("should preserve typeof module in case of a local variable (2)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			project: {
				files: {
					"index.ts": `
                       function hello(){
                            var module = 1;
                            var t = typeof module;
                       }
                       module.exports.something = hello("123123")

                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("var t = typeof module");
		});
	});
});
