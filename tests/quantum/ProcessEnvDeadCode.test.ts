import { EnvPlugin } from "../../src";
import { createOptimisedBundleEnv } from "../_helpers/stubs/TestEnvironment";

describe("RemoveStrictTest", () => {
	it("Should not bundle dead code", () => {
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
                    if ( process.env.NODE_ENV !== "production") {
                        console.log("hello")
                    }`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			console.log(contents);
			expect(contents).not.toContain("hello");
		});
	});

	it("Should not bundle dead code with process.env['NODE_ENV']", () => {
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
                    if ( process.env["NODE_ENV"] !== "production") {
                        console.log("hello")
                    }`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("hello");
		});
	});

	it("Should not bundle with undefined value", () => {
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
                    if ( process.env.FOO !== undefined) {
                        console.log("hello")
                    }`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("hello");
		});
	});

	it("Should unwrap condition", () => {
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
                    if ( process.env.NODE_ENV === "production") {
                        console.log("production")
                    }`,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).toContain("production");
		});
	});
	it("Should bundle alternative code / opposite of false", () => {
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
                        if ( process.env.NODE_ENV !== "production") {
                            require("./dev")
                        } else {
                            console.log("hello")
                        }

                    `,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("if");
			expect(contents).toContain("hello");
		});
	});

	it("Should bundle consequent code / opposite of true", () => {
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
                        if ( process.env.NODE_ENV === "production") {
                            console.log("production")
                        } else {
                            console.log("development")
                        }

                    `,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("development");
			expect(contents).toContain("production");
		});
	});

	it("Should not bundle unrelated module", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
				removeExportsInterop: false,
			},
			project: {
				natives: {
					process: false,
				},
				files: {
					"index.ts": `
                        if ( process.env.NODE_ENV !== "production") {
                            require("./dev")
                        } else {
                            console.log("development")
                        }

                    `,
					"dev.ts": `console.log("i am dev")`,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
			expect(contents).not.toContain("i am dev");
		});
	});

	it("Should not bundle dead code on a custom process.env variable", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "eh" })],
				files: {
					"index.ts": `

                    if ( process.env.foo === "bar") {
                        console.log("hello")
                    }

                    `,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).not.toContain("hello");
		});
	});

	it("Should bundle alternate code on a custom process.env variable", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				removeExportsInterop: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "eh" })],
				files: {
					"index.ts": `

                    if ( process.env.foo === "bar") {
                        console.log("wrong")
                    } else {
                        console.log("correct")
                    }

                    `,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];

			expect(contents).not.toContain("wrong");
			expect(contents).toContain("correct");
		});
	});

	it("Should remove double mention in dev env", () => {
		return createOptimisedBundleEnv({
			stubs: true,
			options: {
				treeshake: true,
				removeExportsInterop: false,
			},
			project: {
				plugins: [EnvPlugin({ foo: "eh" })],
				files: {
					"index.ts": `

                        if (process.env.NODE_ENV !== 'production') {
                            require("./dev2")
                            require("./dev")
                        }

                    `,
					"some.ts": `
                        if (process.env.NODE_ENV !== 'production') {
                            require("./dev")
                        }
                    `,
					"dev2.ts": ``,
					"dev.ts": ``,
				},
				instructions: "> index.ts",
			},
		}).then(result => {
			const contents = result.contents["index.js"];
		});
	});
});
