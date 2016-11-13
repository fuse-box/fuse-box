const build = require("./build/commonjs/index.js");
const FuseBox = build.FuseBox;
const fs = require("fs");


const TestPlugin = {
    test: /sub\/.*\.js$/,
    dependencies: ["hello"],
    transform: (file, ast) => {
        file.contents = `${file.contents}
          for (var item in module.exports) { var obj = module.exports[item];
                if (obj.constructor && obj.constructor.prototype) {
                    obj.prototype.hello = "hello world"
                }
          }
        `
    }
}

let fuseBox = new FuseBox({
    homeDir: "test/fixtures/cases/case1",
    modulesFolder: "test/fixtures/modules",
    plugins: [TestPlugin]
});
fuseBox.bundle("> index.js", true).then(data => {
    fs.writeFile("./out.js", data, function(err) {});
}).catch(e => {
    console.log(e);
})