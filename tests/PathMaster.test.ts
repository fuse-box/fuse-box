import * as appRoot from "app-root-path";
import * as path from "path";
import { PathMaster } from "../src/core/PathMaster";
import { WorkFlowContext } from "../src";
import { createRealNodeModule } from "./_helpers/stubs/FuseTestEnv";

const testFolder = path.join(appRoot.path, "/tests/_helpers/fixtures/path-test");
const getTestFolder = name => {
	return path.join(testFolder, name);
};
const testFolderShouldEqual = (a, b) => {
	a = a.replace(/\\/g, "/"); //for Windows OS
	let matched = a.indexOf(b) === a.length - b.length;
	if (!matched) {
		throw new Error(`${a} is not ${b}`);
	}
};

const pm = new PathMaster(new WorkFlowContext(), testFolder);

describe("PathMasterTest", () => {
	it("Should detect node module", () => {
		let result = pm.resolve("foo/lib");
		expect(result.isNodeModule).toBeTruthy();
	});

	it("Should not detect a node module", () => {
		let result = pm.resolve("./foo/lib");
		expect(result.isNodeModule).toEqual(false);
	});

	it("Should propertly detect a node module name", () => {
		let result = pm.resolve("foo/lib");
		expect(result.nodeModuleName).toEqual("foo");
	});

	it("Should detect a partial require from a node_module", () => {
		let result = pm.resolve("foo/lib/bar.js");
		expect(result.nodeModuleExplicitOriginal).toEqual("lib/bar.js");
		expect(result.isNodeModule).toBeTruthy();
	});

	it("Should property join a local file", () => {
		let result = pm.resolve("../foo.js", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/foo.js");
	});

	it("Should property join a local folder with index", () => {
		let result = pm.resolve("../", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/index.js");
	});

	it("Should property join a local file with extension", () => {
		let result = pm.resolve("../some.js", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/some.js");
	});

	it("Should property join a local file without extension", () => {
		let result = pm.resolve("../some", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/some.js");
	});

	it("Should resolve the same folder (index.js)", () => {
		let result = pm.resolve("./", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "/lib/index.js");
	});

	it("Should resolve the same folder but deeper", () => {
		let result = pm.resolve("./../", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/index.js");
	});

	it("Should resolve libs folder", () => {
		let result = pm.resolve("./", getTestFolder("lib/bar"));
		testFolderShouldEqual(result.absPath, "/lib/bar/index.js");
	});

	it("Should recognize a json file", () => {
		let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "/lib/bar/data.json");
	});

	it("Should recognize an xml file", () => {
		let result = pm.resolve("./bar/data.xml", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "/lib/bar/data.xml");
	});

	it("Should recognize an css file", () => {
		let result = pm.resolve("./bar/data.css", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "/lib/bar/data.css");
	});

	it("Should give  cheerio version", () => {
		let result = pm.resolve("cheerio", getTestFolder("lib/"));
		expect(result.nodeModuleInfo.version).toEqual("0.22.0");
	});

	it("Should give propery entry (cheerio)", () => {
		let result = pm.resolve("cheerio", getTestFolder("lib/"));
		testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js");
	});

	it("Should give proper root (cheerio)", () => {
		let result = pm.resolve("cheerio", getTestFolder("lib/"));
		testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio");
	});

	it("Should give proper absPath (cheerio)", () => {
		let result = pm.resolve("cheerio", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "node_modules/cheerio/index.js");
	});

	it("Should give proper absDir (cheerio)", () => {
		let result = pm.resolve("cheerio", getTestFolder("lib/"));
		testFolderShouldEqual(result.absDir, "node_modules/cheerio");
	});

	it("Should find node lib 'path' in asset folder", () => {
		let result = pm.resolve("path", getTestFolder("lib/"));
		expect(result.nodeModuleInfo.version).toEqual("0.0.0");
	});
	it("Should give information explicit cheerio require (absPath)", () => {
		let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
		testFolderShouldEqual(result.absPath, "lib/static.js");
	});

	it("Should give information explicit cheerio require (absDir)", () => {
		let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
		testFolderShouldEqual(result.absDir, "lib");
	});

	it("Should give explicit cheerio require (entry)", () => {
		let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
		testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js");
	});

	it("Should give explicit cheerio require (root)", () => {
		let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
		testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio");
	});

	// fusebox path ******************************************************
	// Local files
	it("Should give a proper fusebox path (json)", () => {
		let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/bar/data.json");
	});

	it("Should give a proper fusebox path (js without ext)", () => {
		let result = pm.resolve("./bar/data", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/bar/data.js");
	});

	it("Should give a proper fusebox path (js with ext)", () => {
		let result = pm.resolve("./bar/data", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/bar/data.js");
	});

	it("Should give a proper fusebox path (on folder)", () => {
		let result = pm.resolve("./bar", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/bar/index.js");
	});

	// Fusebox path external files

	it("Should give give a proper fusebox path on cheerio (without ext)", () => {
		let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/static.js");
	});

	it("Should give give a proper fusebox path on cheerio (with ext)", () => {
		let result = pm.resolve("cheerio/lib/static.js", getTestFolder("lib/"));
		expect(result.fuseBoxPath).toEqual("lib/static.js");
	});

	it("Should not go beyond the limits", () => {
		let result = pm.resolve("../", getTestFolder("./"), getTestFolder("./") + "index.js");
		expect(result.fuseBoxPath).toEqual("index.js");
	});

	it("Should resolve tilda path (on folder)", () => {
		let result = pm.resolve("~/foo", getTestFolder("./bar/data.json"));
		testFolderShouldEqual(result.absPath, "path-test/foo/index.js");
		expect(result.fuseBoxPath).toEqual("foo/index.js");
	});

	it("Should resolve tilda file (on file without ext)", () => {
		let result = pm.resolve("~/some", getTestFolder("./bar/data.json"));

		testFolderShouldEqual(result.absPath, "path-test/some.js");
		expect(result.fuseBoxPath).toEqual("some.js");
	});

	it("Should resolve tilda file (on file with ext)", () => {
		let result = pm.resolve("~/some.js", getTestFolder("./bar/data.json"));

		testFolderShouldEqual(result.absPath, "path-test/some.js");
		expect(result.fuseBoxPath).toEqual("some.js");
	});

	it("Should handle sub module with @ operator", () => {
		const moduleName = "@test-namespace/test-module";
		const moduleMain = "test/path/to/entrypoint.js";

		createRealNodeModule(moduleName, {
			"package.json": JSON.stringify({
				name: moduleName,
				main: moduleMain,
			}),
		});

		const result = pm.resolve(moduleName, getTestFolder("./bar/data.json"));

		expect(result.nodeModuleName).toEqual(moduleName);
		expect(result.fuseBoxPath).toEqual(moduleMain);
	});
});
