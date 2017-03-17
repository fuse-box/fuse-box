import {createEnv} from "./stubs/TestEnvironment";
import {should} from "fuse-test-runner";
import {CoffeePlugin} from "../plugins/js-transpilers/CoffeePlugin";
import {RawPlugin} from "../plugins/RawPlugin";

const coffeeFileSource = `class Demo
                                           demo: -> 
                                            "hello"
`;

export class CoffeePluginTest {
    "Should return compiled CoffeScript code"() {
        return createEnv({
            project: {
                files: {
                    "app.coffee": coffeeFileSource,
                },
                plugins: [
                    [CoffeePlugin({}), RawPlugin({})]
                ],
                instructions: ">app.coffee",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./app.coffee");
            should(out).equal(`var Demo;

Demo = (function() {
  function Demo() {}

  Demo.prototype.demo = function() {
    return "hello";
  };

  return Demo;

})();
`
            );
        });
    }

    "Should handle options"() {
        return createEnv({
            project: {
                files: {
                    "app.coffee": coffeeFileSource,
                },
                plugins: [
                    [CoffeePlugin({
                        bare: false,
                    }), RawPlugin({})]
                ],
                instructions: ">app.coffee",
            },
        }).then((result) => {
            const out = result.project.FuseBox.import("./app.coffee");
            should(out).equal(`(function() {
  var Demo;

  Demo = (function() {
    function Demo() {}

    Demo.prototype.demo = function() {
      return "hello";
    };

    return Demo;

  })();

}).call(this);
`
            );
        });
    }
}
