import { createAbstractFile, createDefaultPackageAbstraction } from "./helper";

describe("BundleAsbtractionTest", () => {
	it("Should find require statements", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`
            var foo = require("./foo");
        `);

		expect(file.requireStatements.entries().next().value[0].value).toEqual("./foo");
	});

	it("Should generate code", async () => {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);
		const cnt = (await file.generate()).content.toString();
		expect(cnt).toEqual("function(){\n" + original + "\n}");
	});

	it("Should modify value and generate", async () => {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);

		let statements = file.findRequireStatements(/.*/);
		expect(statements).toHaveLength(1);

		let foo = statements[0];
		foo.setValue("./bar");
		const cnt = (await file.generate()).content.toString();
		expect(cnt).toEqual("function(){\nvar foo = require('./bar');\n}");
	});

	it("Should modify require function and generate", async () => {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);

		let statements = file.findRequireStatements(/.*/);

		let foo = statements[0];
		foo.setFunctionName("$req");
		const cnt = (await file.generate()).content.toString();
		expect(cnt).toEqual("function(){\nvar foo = $req('./foo');\n}");
	});

	it("Should create a wrapper", async () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = require('./foo');`);
		file.wrapWithFunction(["a", "b"]);
		const cnt = (await file.generate()).content.toString();
		expect(cnt).toEqual("function(a,b){\nvar foo = require('./foo');\n}");
	});
	it("Should check for require usage / true", async () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = require('./foo');`);

		expect(file.isRequireStatementUsed()).toBeTruthy();
	});

	it("Should check for require usage / false", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = {}`);

		expect(file.isRequireStatementUsed()).toEqual(false);
	});

	it("Should check if __dirname is used / true", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = __dirname`);

		expect(file.isDirnameUsed()).toBeTruthy();
	});
	it("Should check if __dirname is used / false", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = {}`);

		expect(file.isDirnameUsed()).toEqual(false);
	});

	it("Should check if __filename is used / true", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = __filename`);

		expect(file.isFilenameUsed()).toBeTruthy();
	});
	it("Should check if __filename is used / false", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = {}`);

		expect(file.isFilenameUsed()).toEqual(false);
	});

	it("Should check if exports are in use / true", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`module.exports = {}`);

		expect(file.isExportInUse()).toBeTruthy();
	});
	it("Should check if exports are in use / false", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`var a= {}`);

		expect(file.isExportInUse()).toEqual(false);
	});

	it("Should resolve an abstract 'js' file", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		worldReference.resolve();
	});

	it("Should identify a dynamic import", async () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('a' + './world')");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		expect(worldReference.isComputed).toBeTruthy();

		worldReference.setFunctionName("$fsx.d");
		const cnt = (await indexFile.generate()).content.toString();
		expect(cnt).toEqual("function(){\n$fsx.d('a' + './world');\n}");
	});

	it("Should bind id", async () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('a' + './world')");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		expect(worldReference.isComputed).toBeTruthy();

		worldReference.bindID(20);
		const cnt = (await indexFile.generate()).content.toString();
		expect(cnt).toEqual("function(){\nrequire.bind({id:20})('a' + './world');\n}");
	});

	it("Should treat FuseBox.import like require", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "FuseBox.import('./world')");
		files.set("foo/bar/world.js", "");
		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];
		expect(worldReference).toBeTruthy();
	});

	it("Should find require references (usedNames) ", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`
	        var foo = require("./foo");
	        console.log(foo.bar)
	        console.log(foo.woo)
	    `);
		const first = [...file.requireStatements][0];
		expect([...first.usedNames]).toEqual(["bar", "woo"]);
	});

	it("Should find named exports ", () => {
		const file = createAbstractFile("index.js");
		file.loadString(`
	        class Foo {

	        }
	        class Bar {

	        }
	        exports.Foo = Foo
	        exports.Bar = Bar
	    `);

		expect(file.namedExports.get("Foo")).toBeTruthy();
		expect(file.namedExports.get("Bar")).toBeTruthy();
	});

	it("Should resolve with trailing slashes", () => {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('~//foo///////bar/////world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);
		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];
		const resolved = worldReference.resolve();
		expect(resolved).toBeTruthy();
	});
});
