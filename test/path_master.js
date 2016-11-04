const build = require("../build/commonjs/index.js");
const should = require("should");

const WorkFlowContext = build.WorkFlowContext;
const PathMaster = build.PathMaster;

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
})