const build = require("../build/commonjs/index.js");
const should = require("should");

const getAbsoluteEntryPath = build.getAbsoluteEntryPath;
const Module = build.Module;
const FuseBox = build.FuseBox;
const ModuleCollection = build.ModuleCollection;

describe("A simple case on directory case-a without npm deps", () => {
    it("Should work", () => {
        let entry = new Module("./test-cases/case-a/index.js");
        let defaultCollection = new ModuleCollection("default", entry);
        defaultCollection.collect();
        let fuseBox = new FuseBox();
        let code = fuseBox.getCollectionSource(defaultCollection, entry)
        code.should.equal(`// index.js
___module___("index.js", function(exports, require, module){
const foo = require("./foo.js");
});
// foo.js
___module___("foo.js", function(exports, require, module){
console.log("I am foo");
});`);

    });

})