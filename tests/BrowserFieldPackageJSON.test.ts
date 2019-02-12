import { createRealNodeModule, FuseTestEnv } from "./_helpers/stubs/FuseTestEnv";

describe("BrowserFieldPackageJsonTest", () => {
	it("Should resolve without specific extension", () => {
		const name = "fuse_test_a";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					"./hello.js": "./target.js",
				},
			}),
			"index.js": `module.exports = require("./hello.js")`,
			"target.js": `module.exports = {target : "world"}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `
                            module.exports.data = require("${name}")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual({ data: { target: "world" } });
				}),
			);
	});

	it("Should resolve with specific extension", () => {
		const name = "fuse_test_b";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					"./hello.js": "./target.js",
				},
			}),
			"index.js": `module.exports = require("./hello")`,
			"target.js": `module.exports = {target : "world"}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `
                            module.exports.data = require("${name}")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual({ data: { target: "world" } });
				}),
			);
	});

	it("Should resolve without opening slash in browser field", () => {
		const name = "fuse_test_c";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					"hello.js": "./target.js",
				},
			}),
			"index.js": `module.exports = require("./hello")`,
			"target.js": `module.exports = {target : "world"}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `
                            module.exports.data = require("${name}")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual({ data: { target: "world" } });
				}),
			);
	});

	it("Should resolve without opening slash and without extension in browser field", () => {
		const name = "fuse_test_d";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					"hello.js": "path",
				},
			}),
			"index.js": `module.exports = require("./hello")`,
			"target.js": `module.exports = {target : "world"}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `
                            module.exports.data = require("${name}")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(typeof index.data.resolve).toBe("function");
				}),
			);
	});

	it("Should resolve by package name", () => {
		const name = "fuse_test_e";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					hello: "target.js",
				},
			}),
			"index.js": `module.exports = require("hello")`,
			"target.js": `module.exports = {target : "world"}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `
                            module.exports.data = require("${name}")
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual({ data: { target: "world" } });
				}),
			);
	});

	it("Should ignore false variable", () => {
		const name = "fuse_test_f";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					path: false,
				},
			}),
			"index.js": `
                if (typeof window === 'undefined') {
                    module.exports = require("path")
                }  else {
                    module.exports = {empty : true}
                }
            `,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `

                            const data =  require("${name}")

                            module.exports = data;
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual({ empty: true });
				}),
			);
	});

	it("Should work nicely with the rest of the package", () => {
		const name = "fuse_test_g";
		createRealNodeModule(name, {
			"package.json": JSON.stringify({
				name: name,
				browser: {
					"hello.js": "target.js",
				},
			}),
			"index.js": `

                module.exports = [ require("path").join("a", "b"), require("./hello") ]

            `,
			"target.js": `module.exports = {target : true}`,
		});
		return FuseTestEnv.create({
			project: {
				target: "browser",
				files: {
					"index.ts": `

                            const data =  require("${name}")

                            module.exports = data;
                        `,
				},
			},
		})
			.simple()
			.then(test =>
				test.browser(window => {
					const index = window.FuseBox.import("./index");
					expect(index).toEqual(["a/b", { target: true }]);
				}),
			);
	});
});
