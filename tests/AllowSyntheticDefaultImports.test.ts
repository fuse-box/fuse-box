import { FuseTestEnv } from "./_helpers/stubs/FuseTestEnv";
import { QuantumPlugin } from "../src";

describe("ImportDynamicExternalFile", () => {
	it("Should allow syntetic imports for browser (regular file) (Vanilla)", () => {
		return FuseTestEnv.create({
			project: {
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `exports.foo = "bar" }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});

	it("Should allow syntetic imports for browser (regular file 2) (Vanilla)", () => {
		return FuseTestEnv.create({
			project: {
				debug: true,
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports.foo = "bar" }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});

	it("Should allow syntetic imports for browser (regular file 3) (Vanilla)", () => {
		return FuseTestEnv.create({
			project: {
				debug: true,
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports = {foo: "bar"} }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});

	it("Should not break on polyfyll NON object 1", () => {
		return FuseTestEnv.create({
			project: {
				debug: true,
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports = false`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual(undefined);
				}),
			);
	});

	it("Should not break on polyfyll NON object 2", () => {
		return FuseTestEnv.create({
			project: {
				debug: true,
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports = 1`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual(undefined);
				}),
			);
	});

	it("Should work with arrays", () => {
		return FuseTestEnv.create({
			project: {
				debug: true,
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports = [1, 2]`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index.result).toEqual([1, 2]);
				}),
			);
	});

	it("Should allow syntetic imports for browser (regular file) (Quantum)", () => {
		return FuseTestEnv.create({
			project: {
				plugins: [QuantumPlugin()],
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `exports.foo = "bar" }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.$fsx.r(0);
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});

	it("Should allow syntetic imports for browser (regular file 2) (Quantum)", () => {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				plugins: [QuantumPlugin()],
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports.foo = "bar" }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.$fsx.r(0);
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});

	it("Should allow syntetic imports for browser (regular file 3) (Quantum)", () => {
		return FuseTestEnv.create({
			testFolder: "_current_test",
			project: {
				allowSyntheticDefaultImports: true,
				useTypescriptCompiler: true,
				plugins: [QuantumPlugin()],
				files: {
					"index.js": `
                            import Foo from "./foo"
                            exports.result = Foo;
                        `,
					"foo.js": `module.exports = {foo: "bar"} }`,
				},
			},
		})
			.simple(">index.js")
			.then(test =>
				test.browser(window => {
					const index = window.$fsx.r(0);
					expect(index.result).toEqual({ foo: "bar" });
				}),
			);
	});
});
