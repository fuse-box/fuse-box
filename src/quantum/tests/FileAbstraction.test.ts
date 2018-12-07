import { should } from "fuse-test-runner";
import { createAbstractFile, createDefaultPackageAbstraction } from "./helper";

export class BundleAsbtractionTest {
	"Should find require statements"() {
		const file = createAbstractFile("index.js");
		file.loadString(`
            var foo = require("./foo");
        `);

		should(file.requireStatements)
			.beSet()
			.mutate(x => file.requireStatements.entries().next().value[0])
			.mutate(x => x.value)
			.equal("./foo");
	}

	async "Should generate code"() {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);
		const cnt = (await file.generate()).content.toString();
		should(cnt).equal("function(){\n" + original + "\n}");
	}

	async "Should modify value and generate"() {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);

		let statements = file.findRequireStatements(/.*/);
		should(statements)
			.beArray()
			.haveLength(1);

		let foo = statements[0];
		foo.setValue("./bar");
		const cnt = (await file.generate()).content.toString();
		should(cnt).equal("function(){\nvar foo = require('./bar');\n}");
	}

	async "Should modify require function and generate"() {
		const file = createAbstractFile("index.js");
		let original = `var foo = require('./foo');`;
		file.loadString(original);

		let statements = file.findRequireStatements(/.*/);

		let foo = statements[0];
		foo.setFunctionName("$req");
		const cnt = (await file.generate()).content.toString();
		should(cnt).equal("function(){\nvar foo = $req('./foo');\n}");
	}

	async "Should create a wrapper"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = require('./foo');`);
		file.wrapWithFunction(["a", "b"]);
		const cnt = (await file.generate()).content.toString();
		should(cnt).equal("function(a,b){\nvar foo = require('./foo');\n}");
	}
	async "Should check for require usage / true"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = require('./foo');`);

		should(file.isRequireStatementUsed()).beTrue();
	}

	"Should check for require usage / false"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var foo = {}`);

		should(file.isRequireStatementUsed()).beFalse();
	}

	"Should check if __dirname is used / true"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = __dirname`);

		should(file.isDirnameUsed()).beTrue();
	}
	"Should check if __dirname is used / false"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = {}`);

		should(file.isDirnameUsed()).beFalse();
	}

	"Should check if __filename is used / true"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = __filename`);

		should(file.isFilenameUsed()).beTrue();
	}
	"Should check if __filename is used / false"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var a = {}`);

		should(file.isFilenameUsed()).beFalse();
	}

	"Should check if exports are in use / true"() {
		const file = createAbstractFile("index.js");
		file.loadString(`module.exports = {}`);

		should(file.isExportInUse()).beTrue();
	}
	"Should check if exports are in use / false"() {
		const file = createAbstractFile("index.js");
		file.loadString(`var a= {}`);

		should(file.isExportInUse()).beFalse();
	}

	"Should resolve an abstract 'js' file"() {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('./world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		worldReference.resolve();
	}

	async "Should identify a dynamic import"() {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('a' + './world')");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		should(worldReference.isComputed).beTrue();

		worldReference.setFunctionName("$fsx.d");
		const cnt = (await indexFile.generate()).content.toString();
		should(cnt).equal("function(){\n$fsx.d('a' + './world');\n}");
	}

	async "Should bind id"() {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('a' + './world')");

		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];

		should(worldReference.isComputed).beTrue();

		worldReference.bindID(20);
		const cnt = (await indexFile.generate()).content.toString();
		should(cnt).equal("function(){\nrequire.bind({id:20})('a' + './world');\n}");
	}

	"Should treat FuseBox.import like require"() {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "FuseBox.import('./world')");
		files.set("foo/bar/world.js", "");
		const pkg = createDefaultPackageAbstraction(files);

		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];
		should(worldReference).beOkay();
	}

	"Should find require references (usedNames) "() {
		const file = createAbstractFile("index.js");
		file.loadString(`
	        var foo = require("./foo");
	        console.log(foo.bar)
	        console.log(foo.woo)
	    `);
		const first = [...file.requireStatements][0];
		should([...first.usedNames]).deepEqual(["bar", "woo"]);
	}

	"Should find named exports "() {
		const file = createAbstractFile("index.js");
		file.loadString(`
	        class Foo {

	        }
	        class Bar {

	        }
	        exports.Foo = Foo
	        exports.Bar = Bar
	    `);

		should(file.namedExports.get("Foo")).beOkay();
		should(file.namedExports.get("Bar")).beOkay();
	}

	"Should resolve with trailing slashes"() {
		const files = new Map<string, string>();
		files.set("foo/bar/index.js", "require('~//foo///////bar/////world')");
		files.set("foo/bar/world.js", "");

		const pkg = createDefaultPackageAbstraction(files);
		const indexFile = pkg.fileAbstractions.get("foo/bar/index.js");
		const worldReference = indexFile.findRequireStatements(/.*/)[0];
		const resolved = worldReference.resolve();
		should(resolved).beOkay();
	}
}
