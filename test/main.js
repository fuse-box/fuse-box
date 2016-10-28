const wiresBundler = require("../build/commonjs/index.js");
const should = require("should");
const FileManager = wiresBundler.FileManager;
const ModuleCompiler = wiresBundler.ModuleCompiler;
const Module = wiresBundler.Module;
const ProjectCompiler = wiresBundler.ProjectCompiler;
console.log(wiresBundler);
describe("Module compiler", () => {
    it("Should give a proper base path", () => {
        let module = new Module("./test-project/index.js");
        module.resolve()

        module.wrap();

    });

})

/*
{
    name : "a.js",
    content : "",
    deps : [
            {name : "b.js"}
            {name : "c.js"}
        ]
    }
}

*/