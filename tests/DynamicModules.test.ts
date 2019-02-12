import { createEnv } from "./_helpers/OldEnv";

describe("DynamicModulesTest", () => {
	it("Should access a dynamic module (without ext)", () => {
		return createEnv({
			project: {
				files: {
					"hello.js": `module.exports = require("./stuff/boo");`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

			expect(fuse.import("./hello")).toEqual({ hello: "dynamic" });
		});
	});

	it("Should access a dynamic module (with ext)", () => {
		return createEnv({
			project: {
				files: {
					"hello.js": `module.exports = require("./stuff/boo.js");`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

			expect(fuse.import("./hello")).toEqual({ hello: "dynamic" });
		});
	});

	it("Should access a dynamic module with tilde (with ext)", () => {
		return createEnv({
			project: {
				files: {
					"hello.js": `module.exports = require("~/stuff/boo.js");`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

			expect(fuse.import("./hello")).toEqual({ hello: "dynamic" });
		});
	});

	it("Should access a dynamic module with tilde (without ext)", () => {
		return createEnv({
			project: {
				files: {
					"hello.js": `module.exports = require("~/stuff/boo");`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.dynamic("stuff/boo.js", "module.exports = {hello : 'dynamic'}");

			expect(fuse.import("./hello")).toEqual({ hello: "dynamic" });
		});
	});

	it("Dynamic module should have access to the scope (with ext)", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "exports.itworks = require('../foo.js')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index");
			expect(fuse.import("./hello/world")).toEqual({
				itworks: {
					foo: "bar",
				},
			});
		});
	});

	it("Dynamic module should have access to the scope (without ext)", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "exports.itworks = require('../foo')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index");
			expect(fuse.import("./hello/world")).toEqual({
				itworks: {
					foo: "bar",
				},
			});
		});
	});

	it("Dynamic module should have access to the scope using tilde (without ext)", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");

			expect(fuse.import("./hello/world.js")).toEqual({ foo: "bar" });
		});
	});

	it("Dynamic module should have access to the scope using tilde (with ext)", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");

			expect(fuse.import("./hello/world.js")).toEqual({ foo: "bar" });
		});
	});

	it("Dynamic module can be overridden", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");
			fuse.dynamic("hello/world.js", "module.exports = {'yes' : true}");

			expect(fuse.import("./hello/world.js")).toEqual({ yes: true });
		});
	});

	it("FuseBox.exists should return true on dynamic module", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic("hello/world.js", "module.exports = require('~/foo.js')")`,
					"foo.js": `module.exports = {foo : "bar"}`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");

			expect(fuse.exists("./hello/world.js")).toEqual(true);
		});
	});

	it("FuseBox.exists should not throw if module is not found", () => {
		return createEnv({
			project: {
				files: { "index.js": `` },
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");

			expect(fuse.exists("app.html")).toEqual(false);
		});
	});

	it("Should register a module in a different package", () => {
		return createEnv({
			project: {
				files: {
					"index.js": `
            FuseBox.dynamic(
                "hello/world.js",
                "module.exports = {hello : 'world'}",
                {pkg : 'foo'}
            )`,
				},
				instructions: "**/*.js",
			},
		}).then(result => {
			const fuse = result.project.FuseBox;
			fuse.import("./index.js");

			expect(fuse.import("foo/hello/world")).toEqual({ hello: "world" });
		});
	});
});
