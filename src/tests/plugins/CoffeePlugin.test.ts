import { CoffeePlugin, RawPlugin } from "../../index";
import { createEnv } from "../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";

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
				plugins: [[CoffeePlugin({}), RawPlugin()]],
				instructions: ">app.coffee",
			},
		}).then(result => {
			const out = result.project.FuseBox.import("./app.coffee");
			should(out).equal(`var Demo;

Demo = (function() {
  function Demo() {}

  Demo.prototype.demo = function() {
    return "hello";
  };

  return Demo;

})();
`);
		});
	}

	"Should handle options"() {
		return createEnv({
			project: {
				files: {
					"app.coffee": coffeeFileSource,
				},
				plugins: [
					[
						CoffeePlugin({
							bare: false,
						}),
						RawPlugin(),
					],
				],
				instructions: ">app.coffee",
			},
		}).then(result => {
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
`);
		});
	}

	"Should allow extension overrides"() {
		return FuseTestEnv.create({
			project: {
				extensionOverrides: [".foo.coffee"],
				plugins: [CoffeePlugin({})],
				files: {
					"hello.coffee": `module.exports = getMessage: -> 'I should not be included'`,
					"hello.foo.coffee": `module.exports = getMessage: -> 'I should be included'`,
				},
			},
		})
			.simple(">hello.coffee")
			.then(env =>
				env.browser(window => {
					should(window.FuseBox.import("./hello.coffee").getMessage()).equal("I should be included");
				}),
			);
	}
}
