const build = require(`../${process.env.TRAVIS ? "dist" : "build"}/commonjs/index.js`);
const should = require("should");
const appRoot = require("app-root-path");
const path = require("path");
const WorkFlowContext = build.WorkFlowContext;
const PathMaster = build.PathMaster;
const testFolder = path.join(appRoot.path, "test/fixtures/path-test");
const getTestFolder = (name) => {
    return path.join(testFolder, name)
}
const testFolderShouldEqual = (a, b) => {
    let matched = a.indexOf(b) === a.length - b.length;
    if (!matched) {
        throw new Error(`${a} is not ${b}`);
    }
}
describe("PathMaster", () => {
    let pm;
    before(() => {
        pm = new PathMaster(new WorkFlowContext(), testFolder)
    });



    it("Should detect node module", () => {
        let result = pm.resolve("foo/lib");
        result.isNodeModule.should.be.equal(true);
    });

    it("Should not detect a node module", () => {
        let result = pm.resolve("./foo/lib");
        result.isNodeModule.should.be.equal(false);
    });

    it("Should propertly detect a node module name", () => {
        let result = pm.resolve("foo/lib");
        result.nodeModuleName.should.be.equal("foo");
    });

    it("Should detect a partial require from a node_module", () => {
        let result = pm.resolve("foo/lib/bar.js");
        result.nodeModuleExplicitOriginal.should.be.equal("lib/bar.js");
        result.isNodeModule.should.be.equal(true);
    });


    it("Should property join a local file", () => {
        let result = pm.resolve("../foo.js", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/foo.js")
    });

    it("Should property join a local folder with index", () => {
        let result = pm.resolve("../", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/index.js")
    });

    it("Should property join a local file with extension", () => {
        let result = pm.resolve("../some.js", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/some.js")
    });

    it("Should property join a local file without extension", () => {
        let result = pm.resolve("../some", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/some.js")
    });

    it("Should resolve the same folder (index.js)", () => {
        let result = pm.resolve("./", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/index.js")
    });

    it("Should resolve the same folder but deeper", () => {
        let result = pm.resolve("./../", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/index.js")
    });

    it("Should resolve libs folder", () => {
        let result = pm.resolve("./", getTestFolder("lib/bar"));
        testFolderShouldEqual(result.absPath, "/lib/bar/index.js")
    });

    it("Should recognize a json file", () => {
        let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.json")
    });

    it("Should recognize an xml file", () => {
        let result = pm.resolve("./bar/data.xml", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.xml")
    });

    it("Should recognize an css file", () => {
        let result = pm.resolve("./bar/data.css", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "/lib/bar/data.css")
    });

    it("Should give  cheerio version", () => {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));

        result.nodeModuleInfo.version.should.equal("0.22.0");
    });

    it("Should give propery entry (cheerio)", () => {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js")
    });

    it("Should give proper root (cheerio)", () => {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio")
    });

    it("Should give proper absPath (cheerio)", () => {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "node_modules/cheerio/index.js")
    });

    it("Should give proper absDir (cheerio)", () => {
        let result = pm.resolve("cheerio", getTestFolder("lib/"));
        testFolderShouldEqual(result.absDir, "node_modules/cheerio")
    });

    it("Should find node lib 'path' in asset folder", () => {
        let result = pm.resolve("path", getTestFolder("lib/"));
        result.nodeModuleInfo.version.should.equal("0.0.0");
    });

    it("Should give information explicit cheerio require (absPath)", () => {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.absPath, "lib/static.js")
    });

    it("Should give information explicit cheerio require (absDir)", () => {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.absDir, "lib");
    });


    it("Should give explicit cheerio require (entry)", () => {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.entry, "node_modules/cheerio/index.js")
    });

    it("Should give explicit cheerio require (root)", () => {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        testFolderShouldEqual(result.nodeModuleInfo.root, "node_modules/cheerio")
    });

    // fusebox path ******************************************************
    // Local files
    it("Should give a proper fusebox path (json)", () => {
        let result = pm.resolve("./bar/data.json", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/bar/data.json");
    });

    it("Should give a proper fusebox path (js without ext)", () => {
        let result = pm.resolve("./bar/data", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/bar/data.js");
    });

    it("Should give a proper fusebox path (js with ext)", () => {
        let result = pm.resolve("./bar/data", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/bar/data.js");
    });

    it("Should give a proper fusebox path (on folder)", () => {
        let result = pm.resolve("./bar", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/bar/index.js");
    });

    // Fusebox path external files

    it("Should give give a proper fusebox path on cheerio (without ext)", () => {
        let result = pm.resolve("cheerio/lib/static", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/static.js");
    });

    it("Should give give a proper fusebox path on cheerio (with ext)", () => {
        let result = pm.resolve("cheerio/lib/static.js", getTestFolder("lib/"));
        result.fuseBoxPath.should.equal("lib/static.js");
    });

    it("Should not go beyond the limits", () => {
        let result = pm.resolve("../", getTestFolder("./"), getTestFolder("./") + "index.js");
        result.fuseBoxPath.should.equal("index.js")
    });

    it("Should resolve tilda path (on folder)", () => {
        let result = pm.resolve("~/foo", getTestFolder("./bar/data.json"));
        testFolderShouldEqual(result.absPath, "path-test/foo/index.js")
        result.fuseBoxPath.should.equal("foo/index.js");
    });

    it("Should resolve tilda file (on file without ext)", () => {
        let result = pm.resolve("~/some", getTestFolder("./bar/data.json"));

        testFolderShouldEqual(result.absPath, "path-test/some.js")
        result.fuseBoxPath.should.equal("some.js");
    });

    it("Should resolve tilda file (on file with ext)", () => {
        let result = pm.resolve("~/some.js", getTestFolder("./bar/data.json"));

        testFolderShouldEqual(result.absPath, "path-test/some.js")
        result.fuseBoxPath.should.equal("some.js");
    });

    it("Should handle sub module with @ operator", () => {
        let result = pm.resolve("@angular/core", getTestFolder("./bar/data.json"));
        console.log(result);
        result.nodeModuleName.should.equal("@angular/core");
        result.fuseBoxPath.should.equal("bundles/core.umd.js");
    });






})