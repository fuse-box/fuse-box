import { EnvPlugin } from "../../src";
import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("ProcessEnvReplacement", () => {
	it("Should replace process env NODE_ENV", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				files: {
					"index.ts": `exports.env = process.env.NODE_ENV`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.env = 'production'");
		});
	});

	it("Should replace process env NODE_ENV with string literal", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				files: {
					"index.ts": `exports.env = process.env["NODE_ENV"]`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.env = 'production'");
		});
	});

	it("Should replace process env (uknown variable to undefined)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				files: {
					"index.ts": `exports.env = process.env.LOL`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.env = undefined");
		});
	});

	it("Should replace process env.foo", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `exports.env = process.env.foo`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("exports.env = 'foo'");
		});
	});

	it("Should console log process.env.foo", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `console.log(process.env.foo)`,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).toContain("console.log('foo')");
		});
	});

	it("Should replace env in the fn call", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `

                        const hello = function(id, info){
                            return info
                        }
                        hello(1, process.env.foo)
                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("hello(1, 'foo')");
		});
	});

	it("Should replace in if else statement", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `
                        if (a) {
                        }  else if (process.env.NODE_ENV !== 'production') {
                        }

                    }
                    `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("else if ('production' !== 'production')");
		});
	});

	it("Should keep process untouched in case of something usage else but replacable objects (treeshake off)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `
						export const res = process.cwd();
          `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).toContain("// process/index.js");
			expect(contents).toContain("var process = $fsx.r(1);");
		});
	});

	it("Should keep process untouched in case of something usage else but replacable objects (treeshake on)", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
			},
			project: {
				plugins: [EnvPlugin({ foo: "foo" })],
				files: {
					"index.ts": `
						export const res = process.cwd();
          `,
				},
				instructions: "index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).toContain("// process/index.js");
			expect(contents).toContain("var process = $fsx.r(1);");
		});
	});
});
