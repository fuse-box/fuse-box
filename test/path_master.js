const build = require("../build/commonjs/index.js");
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
        pm = new PathMaster(new WorkFlowContext())
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
        result.nodeModulePartialOriginal.should.be.equal("lib/bar.js");
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
        console.log(result.absPath);
        //testFolderShouldEqual(result.absPath, "/lib/bar/index.js")
    });


})