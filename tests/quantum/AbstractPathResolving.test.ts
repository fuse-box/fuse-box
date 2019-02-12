import { createBundleAbstraction, createDefaultPackageAbstraction } from "./helper";

describe("AbstractPathResolving", () => {
	it("Should resolve an abstract 'js' file", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual("foo/bar/world.js");
	});

	it("Should resolve an abstract 'jsx' file", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set("foo/bar/world.jsx", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual("foo/bar/world.jsx");
	});

	it("Should resolve an abstract  folder 'js' file", () => {
		const lookup = "foo/bar/world/index.js";
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set(lookup, "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual(lookup);
	});

	it("Should resolve an abstract folder 'jsx' file", () => {
		const lookup = "foo/bar/world/index.jsx";
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set(lookup, "");
		files.set("foo/bar/test.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual(lookup);
	});

	it("Should resolve an abstract  folder 'js' file with opened slash", () => {
		const lookup = "foo/bar/world/index.js";
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world/')");
		files.set(lookup, "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];
		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual(lookup);
	});

	it("Should resolve an abstract  folder 'jsx' file with opened slash", () => {
		const lookup = "foo/bar/world/index.jsx";
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world/')");
		files.set(lookup, "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual(lookup);
	});

	it("Should resolve js file with tilde", () => {
		const lookup = "foo/bar/world.js";
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('~/foo/bar/world')");
		files.set(lookup, "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual(lookup);
	});

	it("Should not resolve a file", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('../world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res).toEqual(undefined);
	});

	it("Should resolve a simple node module", () => {
		const bundleAbstraction = createBundleAbstraction({
			default: {
				files: {
					"index.js": "require('foo')",
				},
			},
			foo: {
				files: {
					"index.js": "",
				},
			},
		});

		let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

		let fooRequired = programIndex.findRequireStatements(/.*/)[0];
		const rq = fooRequired.resolve();
		expect(rq.packageAbstraction.name).toEqual("foo");
		expect(rq.fuseBoxPath).toEqual("index.js");
	});
	it("Should resolve an explicit require statement from node module", () => {
		const bundleAbstraction = createBundleAbstraction({
			default: {
				files: {
					"index.js": "require('foo/stuff')",
				},
			},
			foo: {
				files: {
					"index.js": "",
					"stuff.js": "",
				},
			},
		});

		let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

		let fooRequired = programIndex.findRequireStatements(/.*/)[0];
		const rq = fooRequired.resolve();
		expect(rq.packageAbstraction.name).toEqual("foo");
		expect(rq.fuseBoxPath).toEqual("stuff.js");
	});

	it("Should resolve an explicit require statement (folder) from node module", () => {
		const bundleAbstraction = createBundleAbstraction({
			default: {
				files: {
					"index.js": "require('foo/stuff')",
				},
			},
			foo: {
				files: {
					"index.js": "",
					"stuff/index.js": "",
				},
			},
		});

		let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

		let fooRequired = programIndex.findRequireStatements(/.*/)[0];
		const rq = fooRequired.resolve();
		expect(rq.packageAbstraction.name).toEqual("foo");
		expect(rq.fuseBoxPath).toEqual("stuff/index.js");
	});

	it("Should resolve scoped repository", () => {
		const bundleAbstraction = createBundleAbstraction({
			default: {
				files: {
					"index.js": "require('@angular/core')",
				},
			},
			"@angular/core": {
				files: {
					"index.js": "",
				},
			},
		});

		let programIndex = bundleAbstraction.packageAbstractions.get("default").fileAbstractions.get("index.js");

		let angularCoreRq = programIndex.findRequireStatements(/.*/)[0];
		const rq = angularCoreRq.resolve();
		expect(rq.packageAbstraction.name).toEqual("@angular/core");
		expect(rq.fuseBoxPath).toEqual("index.js");
	});

	it("Should find an abstraction with priority on a file", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set("foo/bar/world/index.js", "");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		const res = worldReference.resolve();

		expect(res.fuseBoxPath).toEqual("foo/bar/world.js");
	});
});
