const should = require("should");
const build = require(`../dist/commonjs/index.js`);
const getTestEnv = require("./fixtures/lib").getTestEnv;
const CoffeePlugin = build.CoffeePlugin;
const RawPlugin = build.RawPlugin;

const file = `
class Demo
  demo: -> 
    "hello"
`;

describe("CoffeeePlugin", () => {
    it("Should return compiled coffee", () => {
        return getTestEnv({
            "app.coffee": file,
        }, ">app.coffee", {
            plugins: [
                [CoffeePlugin({}), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./app.coffee");

            result.should.equal(`var Demo;

Demo = (function() {
  function Demo() {}

  Demo.prototype.demo = function() {
    return "hello";
  };

  return Demo;

})();
`);
            return true;
        });
    });

    it("Should handle options", () => {
        return getTestEnv({
            "app.coffee": file,
        }, ">app.coffee", {
            plugins: [
                [CoffeePlugin({
                    bare: false,
                }), RawPlugin()],
            ],
        }).then(root => {
            let result = root.FuseBox.import("./app.coffee");

            result.should.equal(`(function() {
  var Demo;

  Demo = (function() {
    function Demo() {}

    Demo.prototype.demo = function() {
      return "hello";
    };

    return Demo;

  })();

}).call(this);
`);
            return true;
        });
    });
});
