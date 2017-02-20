const build = require(`../dist/commonjs/index.js`);
import should = require("should");
const ensureImport = should;
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
describe("Extension probbing", () => {
    let pm;
    before(() => {
        console.log(testFolder);
        pm = new PathMaster(new WorkFlowContext(), testFolder)
    });



    it("Should resolve index.ts", () => {
        let result = pm.resolve("./ts/foo", getTestFolder("./"));
        console.log(result);
        //result.isNodeModule.should.be.equal(true);
    });

});