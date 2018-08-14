import { should } from "fuse-test-runner";
import { FuseTestEnv } from "./stubs/FuseTestEnv";
import { QuantumPlugin } from "../index";

export class ImportDynamicExternalFile {
	"Should allow syntetic imports for browser (regular file) (Vanilla)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}

	"Should allow syntetic imports for browser (regular file 2) (Vanilla)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}

	"Should allow syntetic imports for browser (regular file 3) (Vanilla)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}

	"Should not break on polyfyll NON object 1"() {
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
					should(index.result).equal(undefined);
				}),
			);
	}

	"Should not break on polyfyll NON object 2"() {
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
					should(index.result).equal(undefined);
				}),
			);
	}

	"Should work with arrays"() {
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
					should(index.result).deepEqual([1, 2]);
				}),
			);
	}

	"Should allow syntetic imports for browser (regular file) (Quantum)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}

	"Should allow syntetic imports for browser (regular file 2) (Quantum)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}

	"Should allow syntetic imports for browser (regular file 3) (Quantum)"() {
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
					should(index.result).deepEqual({ foo: "bar" });
				}),
			);
	}
}
